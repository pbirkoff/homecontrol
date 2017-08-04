<template>
  <div v-if="loading === true" class="is--loading">
    <img src="/static/img/preloader.png" alt="loading">
  </div>
  <div v-else class="lights-group">
    <div v-if="lights && lightsFound">
      <ul class="list-unstyled">
        <li v-for="light in lights" :key="light.uniqueid">
          <light @statechange="lightStateChange" :state="light.state.on" :light="light"></light>
        </li>
      </ul>
      <div class="button-group mt-2">
        <button @click="allOff()" class="btn btn-primary">Uit</button>
        <button @click="allOffAfterTimer()" class="btn btn-primary">Uit in (<span>{{lightsTimer}}</span>)</button>
        <button @click="allOn()" class="btn btn-primary">Aan</button>
      </div>
    </div>
    <div v-if="!lightsFound">
      Lichten niet gevonden.
  </div>
  </div>
</template>

<script>
import { hueUrl } from '../../config'
import Light from './Light'

export default {
  name: 'hue',
  components: {
    Light
  },
  data () {
    return {
      lights: false,
      lightsFound: false,
      loading: true,
      lightsTimer: 10,
      timer: null
    }
  },
  created () {
    this.getLights()
    // check the lights every 5 minutes. This is an internal IP so we can ping it a lot more often
    setInterval(this.getLights, 300000)
  },
  methods: {
    allOff () {
      for (const i in this.lights) {
        const light = this.lights[i]
        if (light) {
          light.state.on = false
        }
      }
    },
    allOffAfterTimer () {
      if (this.timer !== null) {
        clearInterval(this.timer)
        this.timer = null
      }

      this.lightsTimer--
      this.timer = setInterval(() => {
        this.lightsTimer--
        if (this.lightsTimer <= 0) {
          this.allOff()
          clearInterval(this.timer)
          this.timer = null
          this.lightsTimer = 10
        }
      }, 1000)
    },
    allOn () {
      for (const i in this.lights) {
        const light = this.lights[i]
        if (light) {
          light.state.on = true
        }
      }
    },
    lightStateChange (e) {
      this.lights[e.id].state.on = e.state
    },
    getLights () {
      this.loading = true
      this.$http.get(`${hueUrl}/lights`).then(response => {
        this.loading = false
        if (response.body) {
          this.lightsFound = true
          const allLights = response.body

          // add the key of the light as its ID. Its used to PUT stuff
          for (const key in allLights) {
            allLights[key].id = key
          }

          this.lights = allLights
        }
      }, response => {
        this.loading = false
        this.lightsFound = false
        console.error('Lights not found')
      })
    }
  }
}
</script>
