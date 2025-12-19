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
      picturesInterval: null,
    }
  },
  mounted() {
    this.store.getPictures()
    this.store.getCalendar()
    this.store.getNews()
    this.store.getWeather()

    // Refresh every minute
    this.calendarInterval = setInterval(this.store.getCalendar, 60 * 1000)
    this.newsInterval = setInterval(this.store.getNews, 30 * 60 * 1000) // Every 30 minutes
    this.weatherInterval = setInterval(this.store.getWeather, 15 * 60 * 1000) // Every 15 minutes
    this.picturesInterval = setInterval(this.store.getPictures, 60 * 60 * 1000) // Every hour
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
    if (this.picturesInterval) {
      clearInterval(this.picturesInterval)
    }
  },
})
</script>
