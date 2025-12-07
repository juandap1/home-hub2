import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    _pictures: [],
    _lastKey: null,
    _weather: null,
    _location: null,
    _forecast: [],
    _news: [],
  }),
  getters: {
    pictures: (state) => state._pictures,
    weather: (state) => state._weather,
    location: (state) => state._location,
    forecast: (state) => state._forecast,
    news: (state) => state._news,
  },
  actions: {
    async getWeather() {
      api
        .get('/weather')
        .then((response) => {
          let data = response.data
          this._weather = {
            ...data.current,
            chance_of_rain: data.forecast.forecastday[0].day.daily_chance_of_rain,
            chance_of_snow: data.forecast.forecastday[0].day.daily_chance_of_snow,
            today_high: data.forecast.forecastday[0].day.maxtemp_f,
            today_low: data.forecast.forecastday[0].day.mintemp_f,
          }
          this._location = data.location
          this._forecast = data.forecast.forecastday
        })
        .catch((error) => {
          console.error(error)
        })
    },
    async getPictures() {
      api
        .get('/list-objects', {
          params: {
            prefix: 'pics/',
          },
        })
        .then((response) => {
          this._pictures = response.data.contents.map(
            (content) => 'http://localhost:6989/object/' + content.key,
          )
          this._lastKey = response.data.contents[response.data.contents.length - 1].key
        })
        .catch((error) => {
          console.error(error)
        })
    },
    async getNews() {
      api
        .get('/news')
        .then((response) => {
          console.log(response)
          this._news = response.data.articles
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
