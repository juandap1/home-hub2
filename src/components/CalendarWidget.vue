<template>
  <div class="calendar-widget glass-card">
    <div class="calendar-header">
      <div class="header-left">
        <q-icon name="event" class="header-icon" />
        <span class="header-title">This Week</span>
      </div>
      <span class="month-year">{{ monthYear }}</span>
    </div>

    <div class="week-strip">
      <div
        v-for="day in weekDays"
        :key="day.dayIndex"
        class="week-day"
        :class="{
          today: day.isToday,
          selected: day.fullDate.getTime() == selectedDate.getTime(),
          'has-event': day.hasEvent,
        }"
        @click="selectDate(day)"
      >
        <span class="day-name">{{ day.name }}</span>
        <span class="day-number">{{ day.date }}</span>
        <span v-if="day.hasEvent" class="event-dot" />
      </div>
    </div>

    <div class="events-section">
      <div class="events-header">
        <span>Upcoming</span>
      </div>

      <div class="events-list">
        <div v-if="upcomingEvents.length === 0" class="no-events">No Events</div>
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="event-item"
          :style="{ '--event-color': event.color }"
        >
          <div class="event-time">
            <div>{{ event.time }}</div>
            <div>{{ event.end }}</div>
          </div>
          <div class="event-details">
            <div class="event-title">{{ event.title }}</div>
            <div v-if="event.location" class="event-meta">{{ event.location }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useCounterStore } from 'src/stores/store'

export default defineComponent({
  name: 'CalendarWidget',

  setup() {
    const store = useCounterStore()
    const today = new Date()

    // Color palette for events
    const eventColors = ['#60a5fa', '#4ade80', '#f472b6', '#a78bfa', '#fb923c', '#22d3ee']

    const monthYear = computed(() => {
      return today.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    })
    const now = new Date()
    const selectedDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    console.log(selectedDate.value)

    // Get events from store
    const storeEvents = computed(() => store.events || [])

    // Check if a date has events
    const dateHasEvent = (date) => {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(startOfDay)
      endOfDay.setDate(endOfDay.getDate() + 1)

      return storeEvents.value.some((event) => {
        if (!event.start) return false
        const eventStart = new Date(event.start)
        const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 1000)
        return eventStart < endOfDay && eventEnd > startOfDay
      })
    }

    const weekDays = computed(() => {
      const days = []
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

      // Get the start of the current week (Sunday)
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())

      for (let i = 0; i < 7; i++) {
        let date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        const isToday =
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()

        days.push({
          dayIndex: i,
          name: dayNames[i],
          date: date.getDate(),
          isToday,
          hasEvent: dateHasEvent(date),
          fullDate: date,
        })
      }

      return days
    })

    // Transform store events into display format
    const upcomingEvents = computed(() => {
      const startOfDay = new Date(selectedDate.value)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(startOfDay)
      endOfDay.setDate(endOfDay.getDate() + 1)

      return storeEvents.value
        .filter((event) => {
          if (!event.start) return false
          const eventStart = new Date(event.start)
          const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 1000)
          return eventStart < endOfDay && eventEnd > startOfDay
        })
        .slice(0, 5) // Show max 5 upcoming events
        .map((event, index) => {
          const startDate = new Date(event.start)
          const timeStr = startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })

          const endStr = new Date(event.end).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })

          return {
            id: event.id || index,
            title: event.summary || 'Untitled Event',
            time: timeStr,
            end: endStr,
            location: event.location || '',
            color: eventColors[index % eventColors.length],
          }
        })
    })

    const selectDate = (day) => {
      selectedDate.value = day.fullDate
    }

    return {
      monthYear,
      weekDays,
      upcomingEvents,
      selectDate,
      selectedDate,
    }
  },
})
</script>

<style lang="scss" scoped>
.calendar-widget {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 18px;
  color: var(--accent-purple);
}

.header-title {
  font-size: 14px;
  font-weight: 600;
}

.month-year {
  font-size: 12px;
  color: var(--text-muted);
}

.week-strip {
  display: flex;
  gap: 4px;
}

.week-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  gap: 4px;

  &:hover:not(.today):not(.selected) {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &.selected {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
    box-shadow: 0 0 16px rgba(96, 165, 250, 0.4);

    .day-number {
      font-weight: 700;
    }
  }

  &.today:not(.selected) {
    background: rgba(0, 153, 255, 0.4);
    box-shadow: 0 0 16px rgba(96, 165, 250, 0.4);

    .day-number {
      font-weight: 700;
    }
  }
}

.day-name {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-number {
  font-size: 16px;
  font-weight: 600;
}

.event-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-pink);
}

.events-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.events-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.events-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.no-events {
  font-size: 18px;
  color: white;
  text-align: center;
  padding: 20px;
  opacity: 0.6;
}

.event-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid var(--event-color);
}

.event-time {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 55px;
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-meta {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
