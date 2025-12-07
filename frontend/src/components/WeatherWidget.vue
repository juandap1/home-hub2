<template>
  <div class="weather-widget glass-card">
    <!-- Header Row: Location + Condition -->
    <div class="weather-header">
      <div class="header-left">
        <q-icon name="place" size="12px" />
        <span>{{ locationText }}</span>
      </div>
      <span class="header-condition">{{ weather?.condition.text }}</span>
    </div>

    <!-- Main Row: Temp + Icon + Hi/Lo -->
    <div class="weather-main">
      <div class="main-left">
        <q-icon :name="`img:${weather?.condition.icon}`" class="weather-icon" />
        <span class="main-temp">{{ Math.round(weather?.temp_f) }}°</span>
      </div>
      <div class="main-right">
        <div class="hi-lo-row">
          <span class="hi">↑ {{ Math.round(weather?.today_high) }}°</span>
          <span class="lo">↓ {{ Math.round(weather?.today_low) }}°</span>
        </div>
        <span class="feels">Feels {{ Math.round(weather?.feelslike_f) }}°</span>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="weather-stats">
      <div class="stat">
        <q-icon name="air" size="14px" />
        <span>{{ weather?.wind_mph }} mph</span>
      </div>
      <div class="stat">
        <q-icon name="water_drop" size="14px" />
        <span>{{ weather?.humidity }}%</span>
      </div>
      <div class="stat rain">
        <q-icon name="umbrella" size="14px" />
        <span>{{ weather?.chance_of_rain }}%</span>
      </div>
      <div class="stat snow" v-if="weather?.chance_of_snow > 0">
        <q-icon name="fas fa-snowflake" size="14px" />
        <span>{{ weather?.chance_of_snow }}%</span>
      </div>
    </div>

    <!-- Forecast Row -->
    <div class="weather-forecast">
      <div v-for="day in forecast" :key="day.day" class="forecast-item">
        <span class="forecast-day">{{ day.day.slice(0, 3) }}</span>
        <q-icon :name="`img:${day.condition.icon}`" class="forecast-icon" />
        <span class="forecast-temps">
          <span class="hi">{{ Math.round(day.maxtemp_f) }}°</span>
          <span class="lo">{{ Math.round(day.mintemp_f) }}°</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useCounterStore } from 'src/stores/store'

export default defineComponent({
  name: 'WeatherWidget',

  setup() {
    const store = useCounterStore()
    const weather = computed(() => store.weather)
    const location = computed(() => store.location)
    const forecast = computed(() =>
      store.forecast?.slice(1).map((x) => ({
        ...x.day,
        day: getDayString(x.date),
      })),
    )
    const locationText = computed(() => {
      if (location.value) {
        return location.value.name + ', ' + location.value.region
      }
      return ''
    })

    const getDayString = (day) => {
      const date = new Date(day)
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    }

    return {
      weather,
      forecast,
      locationText,
      getDayString,
    }
  },
})
</script>

<style lang="scss" scoped>
.weather-widget {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
}

// Header
.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-condition {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

// Main Section
.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-icon {
  width: 40px;
  height: 40px;
  font-size: 40px;
}

.main-temp {
  font-size: 42px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -2px;
}

.main-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.hi-lo-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;

  .hi {
    color: #ff9f7a;
  }

  .lo {
    color: #7ac8ff;
  }
}

.feels {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

// Stats Row
.weather-stats {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);

  .q-icon {
    color: rgba(255, 255, 255, 0.5);
  }

  &.rain {
    color: var(--accent-cyan);
    .q-icon {
      color: var(--accent-cyan);
    }
  }

  &.snow {
    color: #a8d4ff;
    .q-icon {
      color: #a8d4ff;
    }
  }
}

// Forecast
.weather-forecast {
  display: flex;
  gap: 4px;
}

.forecast-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.forecast-day {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.forecast-icon {
  width: 22px;
  height: 22px;
  font-size: 22px;
}

.forecast-temps {
  display: flex;
  gap: 6px;
  font-size: 11px;

  .hi {
    font-weight: 600;
  }

  .lo {
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>
