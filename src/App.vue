<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useCounterStore } from './stores/store'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useCounterStore()
    return {
      store,
    }
  },
  data() {
    return {
      calendarInterval: null,
      newsInterval: null,
      weatherInterval: null,
    }
  },
  mounted() {
    this.store.getPictures()
    const refreshData = () => {
      this.store.getWeather()
    }

    // Initial fetch
    refreshData()

    // Refresh every minute
    this.calendarInterval = setInterval(this.store.getCalendar, 60 * 1000)
    this.newsInterval = setInterval(this.store.getNews, 30 * 60 * 1000) // Every 30 minutes
    this.weatherInterval = setInterval(refreshData, 15 * 60 * 1000) // Every 15 minutes
  },
  unmounted() {
    if (this.calendarInterval) {
      clearInterval(this.calendarInterval)
    }
    if (this.newsInterval) {
      clearInterval(this.newsInterval)
    }
    if (this.weatherInterval) {
      clearInterval(this.weatherInterval)
    }
  },
})
</script>
