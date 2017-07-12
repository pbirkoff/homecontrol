<template>
  <div class="weather">
    <div class="weather__temperature">{{ tempFixed }}<span class="weather__temperature-degrees">&#8451;</span></div>
    <div class="weather__city">{{ cityName }} </div>
    <img :class="weatherIcon" class="weather__icon" v-if="icon !== ''">
  </div>
</template>

<script>
import { weatherApiKey } from '../config'

export default {
  name: 'weather',
  data () {
    return {
      cityId: '2751791',
      currentTemperature: 0,
      cityName: '',
      icon: ''
    }
  },
  computed: {
    weatherIcon () {
      return `weather__icon--${this.icon}`
    },
    tempFixed () {
      return this.currentTemperature.toFixed(1)
    }
  },
  created () {
    this.getWeatherInformation()
  },
  methods: {
    getWeatherInformation () {
      // GET /someUrl
      this.$http.get(`http://api.openweathermap.org/data/2.5/weather?id=${this.cityId}&units=metric&appID=${weatherApiKey}`).then(response => {
        if (response.body && response.body.main) {
          const r = response.body
          this.currentTemperature = r.main.temp
          this.cityName = r.name
          this.icon = r.weather[0].icon
        }
      }, response => {
        // error callback
      })
    }
  }
}
</script>
