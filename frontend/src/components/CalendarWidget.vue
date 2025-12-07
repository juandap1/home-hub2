<template>
  <div class="calendar-widget glass-card">
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth">
        <q-icon name="chevron_left" />
      </button>
      <span class="month-year">{{ monthYear }}</span>
      <button class="nav-btn" @click="nextMonth">
        <q-icon name="chevron_right" />
      </button>
    </div>

    <div class="calendar-grid">
      <div class="day-header" v-for="day in weekDays" :key="day">
        {{ day }}
      </div>

      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="calendar-day"
        :class="{
          'other-month': !day.currentMonth,
          today: day.isToday,
          'has-event': day.hasEvent,
        }"
        @click="selectDate(day)"
      >
        <span class="day-number">{{ day.date }}</span>
        <span v-if="day.hasEvent" class="event-dot" />
      </div>
    </div>

    <div class="events-section">
      <div class="events-header">
        <q-icon name="event" />
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
    const currentDate = ref(new Date())
    const selectedDate = ref(new Date())

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    const monthYear = computed(() => {
      return currentDate.value.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    })

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()

      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      const days = []
      const today = new Date()

      // Days from previous month
      const startDayOfWeek = firstDay.getDay()
      const prevMonthLastDay = new Date(year, month, 0).getDate()

      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: prevMonthLastDay - i,
          currentMonth: false,
          isToday: false,
          hasEvent: false,
        })
      }

      // Days of current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const isToday =
          i === today.getDate() && month === today.getMonth() && year === today.getFullYear()

        days.push({
          date: i,
          currentMonth: true,
          isToday,
          hasEvent: [7, 12, 15, 22, 25].includes(i), // Mock events
        })
      }

      // Days from next month
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          currentMonth: false,
          isToday: false,
          hasEvent: false,
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

    const prevMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1,
      )
    }

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1,
      )
    }

    const selectDate = (day) => {
      if (day.currentMonth) {
        selectedDate.value = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth(),
          day.date,
        )
      }
    }

    const viewEvent = (event) => {
      console.log('View event:', event.title)
    }

    return {
      weekDays,
      monthYear,
      calendarDays,
      upcomingEvents,
      prevMonth,
      nextMonth,
      selectDate,
      viewEvent,
    }
  },
})
</script>

<style lang="scss" scoped>
.calendar-widget {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.month-year {
  font-size: 16px;
  font-weight: 600;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  &:active {
    transform: scale(0.9);
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day-header {
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  gap: 2px;

  &:hover:not(.other-month) {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.9);
  }

  &.other-month {
    .day-number {
      color: var(--text-muted);
      opacity: 0.4;
    }
  }

  &.today {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.4);

    .day-number {
      font-weight: 700;
    }
  }
}

.day-number {
  font-size: 12px;
  font-weight: 500;
}

.event-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-pink);
}

.events-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.events-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);

  .q-icon {
    font-size: 18px;
    color: var(--accent-purple);
  }
}

.events-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
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
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.event-details {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-meta {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
