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
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="event-item"
          :style="{ '--event-color': event.color }"
          @click="viewEvent(event)"
        >
          <div class="event-time">{{ event.time }}</div>
          <div class="event-details">
            <div class="event-title">{{ event.title }}</div>
            <div class="event-meta">{{ event.location }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CalendarWidget',

  setup() {
    const today = new Date()

    const monthYear = computed(() => {
      return today.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    })

    const weekDays = computed(() => {
      const days = []
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

      // Get the start of the current week (Sunday)
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)

        const isToday =
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()

        days.push({
          dayIndex: i,
          name: dayNames[i],
          date: date.getDate(),
          isToday,
          hasEvent: [1, 3, 5].includes(i), // Mock: events on Mon, Wed, Fri
          fullDate: date,
        })
      }

      return days
    })

    const upcomingEvents = ref([
      {
        id: 1,
        title: 'Team Standup',
        time: '9:00 AM',
        location: 'Zoom Meeting',
        color: '#60a5fa',
      },
      {
        id: 2,
        title: 'Lunch with Sarah',
        time: '12:30 PM',
        location: 'Cafe Milano',
        color: '#4ade80',
      },
      {
        id: 3,
        title: 'Doctor Appointment',
        time: '3:00 PM',
        location: 'Medical Center',
        color: '#f472b6',
      },
    ])

    const selectDate = (day) => {
      console.log('Selected:', day.fullDate)
    }

    const viewEvent = (event) => {
      console.log('View event:', event.title)
    }

    return {
      monthYear,
      weekDays,
      upcomingEvents,
      selectDate,
      viewEvent,
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

  &:hover:not(.today) {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &.today {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
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
  overflow-y: auto;
}

.event-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid var(--event-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }

  &:active {
    transform: scale(0.98);
  }
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
