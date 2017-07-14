<template>
  <div class="weather">
    <datetime class="weather__datetime"></datetime>
    <div class="weather__temperature">
      {{ tempFixed }}<i class="wi wi-celsius"></i>
    </div>
    <div class="weather__city">{{ cityName }} </div>
    <div class="weather__status">
      <div class="weather__status-icon wi" :class="skyIcon"></div>
      <div class="weather__status-wind">
        <i class="weather__status-wind-bft" :class="beaufortClass"></i>
        <i class="wi wi-wind towards-0-deg" :style="windDirection"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Datetime from './Datetime'
import { weatherApiKey, weatherCityId } from '../config'

export default {
  name: 'weather',
  components: {
    Datetime
  },
  data () {
    return {
      cityId: weatherCityId,
      currentTemperature: 0,
      cityName: '',
      skyDescription: '',
      windSpeed: 0,
      windDirectionDegrees: ''
    }
  },
  computed: {
    skyIcon () {
      if (this.skyDescription === 'broken-clouds') {
        return 'wi-cloudy'
      }

      if (this.skyDescription === 'few-clouds' || this.skyDescription === 'scattered-clouds' || this.skyDescription === 'overcast-clouds') {
        return 'wi-cloud'
      }

      if (this.skyDescription === 'clear-sky') {
        return 'wi-day-sunny'
      }

      if (this.skyDescription === 'shower-rain' || this.skyDescription === 'rain') {
        return 'wi-rain'
      }

      if (this.skyDescription === 'thunderstorm') {
        return 'wi-thunderstorm'
      }

      if (this.skyDescription === 'snow') {
        return 'wi-snow'
      }

      if (this.skyDescription === 'mist') {
        return 'wi-fog'
      }

      if (this.skyDescription === 'moderate-rain') {
        return 'wi-rain-mix'
      }

      if (this.skyDescription === 'light-rain' || this.skyDescription === 'drizzle') {
        return 'wi-raindrops'
      }

      if (this.skyDescription === 'rain') {
        return 'wi-rain'
      }
    },
    tempFixed () {
      return this.currentTemperature.toFixed(1)
    },
    beaufortClass () {
      return `wi wi-wind-beaufort-${this.beaufort}`
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

    // recheck the weather every 15 minutes
    setInterval(this.getWeatherInformation, 900000)
  },
  methods: {
    getWeatherInformation () {
      // GET /someUrl
      this.$http.get(`http://api.openweathermap.org/data/2.5/weather?id=${this.cityId}&units=metric&appID=${weatherApiKey}`).then(response => {
        if (response.body && response.body.main) {
          const r = response.body
          this.currentTemperature = r.main.temp
          this.cityName = r.name

          // descriptin is something like "broken clouds"
          this.skyDescription = r.weather[0].description.replace(' ', '-')

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
