import { serve, S3Client } from "bun";
import { createDAVClient } from "tsdav";
const ical = require("node-ical");

const PORT = 6989;
const client = new S3Client({
  accessKeyId: process.env.MINIO_ROOT_USER,
  secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
  bucket: "bran-bucket",
  endpoint: process.env.MINIO_ENDPOINT,
});

const caldavClient = await createDAVClient({
  serverUrl: process.env.CALDAV_URL || "http://173.73.175.116:5232",
  credentials: {
    username: process.env.CALDAV_USER || "admin",
    password: process.env.CALDAV_PASS || "",
  },
  authMethod: "Basic",
  defaultAccountType: "caldav",
});

const calendars = await caldavClient.fetchCalendars();

const weather_api = process.env.WEATHER_API_KEY;
const news_api = process.env.NEWS_API_KEY;

function postProcessResponse(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

function generateUID(): string {
  // Simple UID generation using current time and random number
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

function createIcalEvent(
  summary: string,
  start: Date,
  end: Date,
  uid: string
): string {
  // CalDAV requires dates to be in UTC (Z) and compressed format (YYYYMMDDTHHMMSS)
  const formatTime = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TSDAV Insert Event//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatTime(new Date())}
DTSTART:${formatTime(start)}
DTEND:${formatTime(end)}
SUMMARY:${summary}
END:VEVENT
END:VCALENDAR`;
}

serve({
  port: PORT,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const method = req.method;

    if (path === "/") {
      return postProcessResponse(new Response("Hello World"));
    }

    if (path === "/weather" && method === "GET") {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${weather_api}&q=20854&days=4`
      );

      const data = await response.json();

      return postProcessResponse(new Response(JSON.stringify(data)));
    }

    if (path === "/news" && method === "GET") {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${news_api}`
      );
      const data = await response.json();
      return postProcessResponse(new Response(JSON.stringify(data)));
    }

    if (path === "/calendar" && method === "GET") {
      const now = new Date();
      const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      const oneYearFromNow = new Date(
        now.getTime() + 365 * 24 * 60 * 60 * 1000
      );
      let parsedEvents = [];
      for (const calendar of calendars) {
        const calendarObjects = await caldavClient.fetchCalendarObjects({
          calendar: calendar,
          timeRange: {
            start: start.toISOString(),
            end: oneYearFromNow.toISOString(),
          },
        });
        calendarObjects.forEach((event) => {
          let parsed = Object.values(ical.parseICS(event.data)).find(
            (value: any) => value.type === "VEVENT"
          );
          parsedEvents.push({
            ...parsed,
            calendar: calendar.displayName,
            calendarColor: calendar.calendarColor,
          });
        });
      }
      return postProcessResponse(new Response(JSON.stringify(parsedEvents)));
    }

    if (req.method === "POST" && path === "/events") {
      if (myCalendar == null)
        return postProcessResponse(new Response("No calendar found"));
      try {
        // --- 1. Define Event Details ---
        const uid = generateUID();
        const summary = "TSDAV-Created Test Appointment";
        const start = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // Start 2 days from now
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1-hour duration

        // --- 2. Construct iCalendar String ---
        const icalString = createIcalEvent(summary, start, end, uid);

        // --- 3. Define Filename ---
        // The filename must be unique and end with .ics. Using the UID is standard.
        const eventFilename = `${uid}.ics`;

        // --- 4. Call the TSDAV Method ---
        await caldavClient.createCalendarObject({
          calendar: myCalendar,
          filename: eventFilename,
          iCalString: icalString,
        });

        console.log(`✅ Successfully inserted new event: "${summary}"`);
        console.log(`Filename: ${eventFilename}`);
        return postProcessResponse(new Response("Event created successfully"));
      } catch (error) {
        console.error("❌ Failed to insert event into CalDAV server:", error);
      }
    }

    if (path === "/upload" && method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof File)) {
        return postProcessResponse(
          new Response("No file provided.", { status: 400 })
        );
      }
      const fileName = file.name;
      const destination = `pics/${fileName}`;
      await client.write(destination, file);

      console.log(`File uploaded successfully: ${destination}`);
      return postProcessResponse(
        new Response(`File uploaded successfully saved as ${destination}`, {
          status: 200,
        })
      );
    }

    if (path === "/logo" && method === "GET") {
      const company = new URL(req.url).searchParams.get("company");
      const domain = new URL(req.url).searchParams.get("domain");

      const s3Logo = client.file(`logos/${company}.png`);
      let s3Exists = await s3Logo.exists();
      if (s3Exists) return postProcessResponse(new Response(s3Logo));

      const response = await fetch(
        `https://img.logo.dev/${domain}?token=${process.env.LOGO_API_KEY}`
      );
      // const contentType = response.headers.get("Content-Type");
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await client.write(`logos/${company}.png`, buffer);
      return postProcessResponse(new Response(buffer));
    }

    if (path === "/list-objects" && method === "GET") {
      const url = new URL(req.url);
      const prefix = url.searchParams.get("prefix") || "";
      const objects = await client.list({
        prefix,
        delimiter: "/",
      });
      return postProcessResponse(
        new Response(JSON.stringify(objects), { status: 200 })
      );
    }

    if (path.startsWith("/object/") && method === "GET") {
      const key = path.substring("/object/".length);
      // console.log(key);
      if (!key) {
        return postProcessResponse(
          new Response("No key provided.", { status: 400 })
        );
      }
      const object = client.file(key);
      // console.log(object);
      // console.log(object.size);
      if (!object || object.size === 0) {
        return postProcessResponse(
          new Response("Object not found.", { status: 404 })
        );
      }
      return postProcessResponse(new Response(object));
    }

    if (path.startsWith("/object/") && method === "DELETE") {
      const key = path.substring("/object/".length);
      await client.delete(key);
      return postProcessResponse(
        new Response("Object deleted successfully", { status: 200 })
      );
    }

    // 404s
    return postProcessResponse(new Response("Page not found", { status: 404 }));
  },
});

console.log(`Listening on http://localhost:${PORT} ...`);
