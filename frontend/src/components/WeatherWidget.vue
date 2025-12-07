<template>
  <div class="glass-card weather-widget">
    <div class="weather-row">
      <div class="weather-main-info">
        <q-icon :name="weather.icon" class="weather-icon" />
        <span class="weather-temp">{{ weather.temp }}°F</span>
      </div>
      <div class="weather-stats">
        <div class="stat-item">
          <q-icon name="air" size="14px" />
          <span>{{ weather.wind }} mph</span>
        </div>
        <div class="stat-item">
          <q-icon name="water_drop" size="14px" />
          <span>{{ weather.humidity }}%</span>
        </div>
        <div v-if="weather.rainChance > 0" class="stat-item rain">
          <q-icon name="umbrella" size="14px" />
          <span>{{ weather.rainChance }}%</span>
        </div>
      </div>
    </div>
    <div class="weather-details">
      <span class="weather-condition">{{ weather.condition }}</span>
      <span class="weather-location">
        <q-icon name="place" size="12px" />
        {{ weather.location }}
      </span>
    </div>
    <div class="weather-forecast">
      <div v-for="day in forecast" :key="day.day" class="forecast-day">
        <span class="forecast-label">{{ day.day }}</span>
        <q-icon :name="day.icon" size="18px" />
        <span class="forecast-temps">
          <span class="hi">{{ day.high }}°</span>
          <span class="lo">{{ day.low }}°</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'WeatherWidget',

  setup() {
    const weather = ref({
      temp: 45,
      condition: 'Partly Cloudy',
      location: 'Pittsburgh, PA',
      icon: 'nights_stay',
      wind: 12,
      humidity: 65,
      rainChance: 20,
    })

    const forecast = ref([
      { day: 'Sat', icon: 'cloud', high: 48, low: 35 },
      { day: 'Sun', icon: 'wb_sunny', high: 52, low: 38 },
      { day: 'Mon', icon: 'water_drop', high: 44, low: 32 },
    ])

    const selectDay = (day) => {
      console.log('Selected day:', day.name)
    }

    return {
      weather,
      forecast,
      selectDay,
    }
  },
})
</script>

<style lang="scss" scoped>
.weather-widget {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
}

.weather-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-main-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weather-icon {
  font-size: 32px;
  color: var(--accent-cyan);
  filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.4));
}

.weather-temp {
  font-size: 32px;
  font-weight: 300;
}

.weather-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);

  .q-icon {
    color: rgba(255, 255, 255, 0.6);
  }

  &.rain {
    color: var(--accent-cyan);
    .q-icon {
      color: var(--accent-cyan);
    }
  }
}

.weather-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-condition {
  font-size: 14px;
  font-weight: 500;
}

.weather-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.weather-forecast {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  padding: 8px 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .q-icon {
    color: var(--accent-yellow);
  }
}

.forecast-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.forecast-temps {
  display: flex;
  gap: 6px;
  font-size: 12px;

  .hi {
    font-weight: 600;
  }

  .lo {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
