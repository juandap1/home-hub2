<template>
  <q-page class="home-hub">
    <!-- Header Bar -->
    <header class="hub-header">
      <div class="header-left">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }}</div>
      </div>
      <div class="header-right">
        <div class="status-indicator">
          <q-icon name="wifi" />
        </div>
        <div class="status-indicator">
          <q-icon name="home" />
        </div>
      </div>
    </header>

    <!-- Main Dashboard -->
    <main class="hub-main">
      <!-- Top Row: Weather -->
      <div class="widget-weather">
        <WeatherWidget />
      </div>

      <!-- Bottom Row: Photos, Calendar, News -->
      <div class="hub-bottom-row">
        <div class="widget-photos">
          <PhotoWidget />
        </div>

        <div class="widget-calendar">
          <CalendarWidget />
        </div>

        <div class="widget-news">
          <NewsWidget />
        </div>
      </div>
    </main>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import WeatherWidget from 'src/components/WeatherWidget.vue'
import PhotoWidget from 'src/components/PhotoWidget.vue'
import CalendarWidget from 'src/components/CalendarWidget.vue'
import NewsWidget from 'src/components/NewsWidget.vue'

export default defineComponent({
  name: 'IndexPage',

  components: {
    WeatherWidget,
    PhotoWidget,
    CalendarWidget,
    NewsWidget,
  },

  setup() {
    const currentTime = ref('')
    const currentDate = ref('')
    let timeInterval = null

    const updateTime = () => {
      const now = new Date()

      currentTime.value = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      currentDate.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }

    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    return {
      currentTime,
      currentDate,
    }
  },
})
</script>

<style lang="scss" scoped>
.home-hub {
  min-height: 100vh;
  padding: 24px 24px 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: transparent;
}

// Header
.hub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.time {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -1px;
  line-height: 1;
}

.date {
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 400;
}

.header-right {
  display: flex;
  gap: 12px;
}

.status-indicator {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;

  .q-icon {
    font-size: 20px;
    color: var(--accent-green);
  }
}

// Main Layout
.hub-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  max-height: calc(100vh - 160px);
}

// Weather Row (top)
.widget-weather {
  flex-shrink: 0;
  animation: fadeIn 0.6s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

// Bottom Row
.hub-bottom-row {
  flex: 1;
  display: grid;
  grid-template-columns: 35fr 35fr 30fr;
  gap: 20px;
  min-height: 0;
}

.widget-photos,
.widget-calendar,
.widget-news {
  min-height: 0;
  animation: fadeIn 0.6s ease forwards;
}

.widget-photos {
  animation-delay: 0.2s;
  opacity: 0;
}

.widget-calendar {
  animation-delay: 0.3s;
  opacity: 0;
}

.widget-news {
  animation-delay: 0.4s;
  opacity: 0;
}

// Responsive adjustments for smaller screens
@media (max-width: 1200px) {
  .hub-bottom-row {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .widget-photos {
    grid-column: 1;
    grid-row: 1;
  }

  .widget-calendar {
    grid-column: 2;
    grid-row: 1;
  }

  .widget-news {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 800px) {
  .home-hub {
    padding: 16px;
    gap: 16px;
  }

  .time {
    font-size: 36px;
  }

  .date {
    font-size: 14px;
  }

  .hub-main {
    max-height: none;
  }

  .hub-bottom-row {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .widget-photos,
  .widget-calendar,
  .widget-news {
    min-height: 300px;
    grid-column: 1;
  }

  .widget-photos {
    grid-row: 1;
  }

  .widget-calendar {
    grid-row: 2;
  }

  .widget-news {
    grid-row: 3;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
