import { serve } from "bun";

const PORT = 6989;

function postProcessResponse(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

serve({
  port: PORT,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const method = req.method;

    if (path === "/") {
      return postProcessResponse(new Response("Hello World"));
    }

    // 404s
    return postProcessResponse(new Response("Page not found", { status: 404 }));
  },
});

console.log(`Listening on http://localhost:${PORT} ...`);
