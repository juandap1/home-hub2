<template>
  <div class="weather-widget glass-card">
    <div class="weather-top">
      <div class="weather-main">
        <div class="weather-icon">
          <q-icon :name="currentWeather.icon" />
        </div>
        <div class="weather-temp">
          <span class="temp-value">{{ currentWeather.temp }}</span>
          <span class="temp-unit">°F</span>
        </div>
      </div>

      <div class="weather-details">
        <div class="weather-condition">{{ currentWeather.condition }}</div>
        <div class="weather-location">
          <q-icon name="place" size="14px" />
          {{ currentWeather.location }}
        </div>
        <div class="weather-stats">
          <div class="stat">
            <q-icon name="water_drop" />
            <span>{{ currentWeather.humidity }}%</span>
          </div>
          <div class="stat">
            <q-icon name="air" />
            <span>{{ currentWeather.wind }} mph</span>
          </div>
        </div>
      </div>
    </div>

    <div class="forecast">
      <div v-for="day in forecast" :key="day.name" class="forecast-day" @click="selectDay(day)">
        <span class="day-name">{{ day.name }}</span>
        <q-icon :name="day.icon" class="day-icon" />
        <span class="day-temp">{{ day.temp }}°</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'WeatherWidget',

  setup() {
    const currentWeather = ref({
      temp: 45,
      condition: 'Partly Cloudy',
      location: 'Pittsburgh, PA',
      humidity: 65,
      wind: 8,
      icon: 'nights_stay',
    })

    const forecast = ref([
      { name: 'Sun', temp: 48, icon: 'wb_sunny' },
      { name: 'Mon', temp: 42, icon: 'cloud' },
      { name: 'Tue', temp: 38, icon: 'ac_unit' },
      { name: 'Wed', temp: 44, icon: 'wb_cloudy' },
      { name: 'Thu', temp: 50, icon: 'wb_sunny' },
    ])

    const selectDay = (day) => {
      console.log('Selected day:', day.name)
    }

    return {
      currentWeather,
      forecast,
      selectDay,
    }
  },
})
</script>

<style lang="scss" scoped>
.weather-widget {
  padding: 20px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
}

.weather-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-icon {
  font-size: 48px;
  color: var(--accent-cyan);
  animation: float 3s ease-in-out infinite;

  .q-icon {
    filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.4));
  }
}

.weather-temp {
  display: flex;
  align-items: flex-start;
}

.temp-value {
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -2px;
}

.temp-unit {
  font-size: 18px;
  font-weight: 400;
  color: var(--text-secondary);
  margin-top: 4px;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.weather-condition {
  font-size: 16px;
  font-weight: 500;
}

.weather-location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.weather-stats {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 12px;

  .q-icon {
    font-size: 16px;
    color: var(--accent-blue);
  }
}

.forecast {
  display: flex;
  gap: 8px;
  padding-left: 24px;
  border-left: 1px solid var(--glass-border);
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 56px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.day-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-icon {
  font-size: 22px;
  color: var(--accent-orange);
}

.day-temp {
  font-size: 14px;
  font-weight: 600;
}

// Responsive
@media (max-width: 800px) {
  .weather-widget {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .weather-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .forecast {
    padding-left: 0;
    padding-top: 16px;
    border-left: none;
    border-top: 1px solid var(--glass-border);
    justify-content: space-between;
  }
}
</style>
