<template>
  <div class="weather">
    <div class="weather__temperature">{{ tempFixed }}<span class="weather__temperature-degrees">&#8451;</span></div>
    <div class="weather__city">{{ cityName }} </div>
    <div :class="weatherIcon" class="weather__icon" v-if="icon !== ''"></div>
    <div class="weather__wind">
      <div class="weather__wind-bft">{{ beaufort }}BFT</div>
      <div class="weather__wind-icon"></div>
      <i class="fa fa-arrow-up" :style="windDirection"></i>
    </div>
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
      icon: '',
      windSpeed: 0,
      windDirectionDegrees: ''
    }
  },
  computed: {
    weatherIcon () {
      return `weather__icon--${this.icon}`
    },
    tempFixed () {
      return this.currentTemperature.toFixed(1)
    },
    beaufort () {
      if (this.windSpeed <= 0.2) {
        return 0
      }

      if (this.windSpeed <= 1.5) {
        return 1
      }

      if (this.windSpeed <= 3.3) {
        return 2
      }

      if (this.windSpeed <= 5.4) {
        return 3
      }

      if (this.windSpeed <= 7.9) {
        return 4
      }

      if (this.windSpeed <= 10.7) {
        return 5
      }

      if (this.windSpeed <= 13.8) {
        return 6
      }

      return '6+'
    },
    windDirection () {
      // the wind direction given by the API is where it's coming from. We want the arrow to point where its going to
      // so add a 180 degrees to flip it
      return `transform: rotate(${this.windDirectionDegrees + 180}deg)`
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

          this.windSpeed = r.wind.speed
          this.windDirectionDegrees = r.wind.deg
        }
      }, response => {
        console.error('Weather not found')
      })
    }
  }
}
</script>
