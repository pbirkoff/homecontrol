<template>
  <div class="lights-group">
    <div v-if="loading === true">
      Laden
    </div>
    <div v-else>
      <div v-if="lights && lightsFound">
        <light @statechange="lightStateChange" :state="light.state.on" :light="light" v-for="light in lights" :key="light.uniqueid"></light>
        <button @click="allOff()">Alle uit</button>
        <button @click="allOn()">Alle aan</button>
      </div>
      <div v-if="!lightsFound">
        Lichten niet gevonden.
      </div>
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
      loading: true
    }
  },
  computed: {

  },
  created () {
    this.getLights()
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
      this.$http.get(`${hueUrl}/lights`).then(response => {
        if (response.body) {
          this.lightsFound = true
          this.loading = false
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
