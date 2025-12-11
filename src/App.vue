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
  mounted() {
    this.store.getWeather()
    this.store.getPictures()
    this.store.getNews()
    this.store.getCalendar()
  },
})
</script>
