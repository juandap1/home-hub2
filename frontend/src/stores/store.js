import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    _pictures: [],
    _lastKey: null,
    _weather: null,
  }),
  getters: {
    pictures: (state) => state._pictures,
    weather: (state) => state._weather,
  },
  actions: {
    async getWeather() {
      api
        .get('/weather')
        .then((response) => {
          this._weather = response.data
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
