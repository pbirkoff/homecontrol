<template>
  <div class="lights-group__item">
    <h2 class="lights-group__item-title">{{ light.name }}</h2>
    <span class="" :class="stateClass">{{ stateText }}</span>
    <button @click="changeState(!light.state.on)">Aan/uit</button>
    <input type="range" min="0" max="255" v-model="light.state.bri">
  </div>
</template>

<script>
import { hueUrl } from '../../config'
export default {
  name: 'hue-light',
  props: ['light', 'state'],
  watch: {
    'state': function (s) {
      this.changeState(s)
    },
    'light.state.bri': function (e) {
      // when the brightness is changed, don't go fire the API right away, wait half a second
      // before doing so, this prevents sending 200 calls in half a second
      if (this.brightnessCountdown) {
        clearTimeout(this.brightnessCountdown)
        this.brightnessCountdown = null
      }

      this.brightnessCountdown = setTimeout(() => {
        this.changeState(this.light.state.on, e)
      }, 500)
    }
  },
  data () {
    return {
      brightnessCountdown: null
    }
  },
  computed: {
    stateText () {
      return (this.light.state.on) ? 'Aan' : 'Uit'
    },
    stateClass () {
      return (this.light.state.on) ? 'lights-group__item-status-is--on' : 'lights-group__item-status-is--off'
    }
  },
  methods: {
    changeState (state, bri = false) {
      // if no bri is set, turn it completely off on state false and completely on on state true
      if (bri === false) {
        bri = (state === false) ? 0 : 254
      }

      const data = {
        'on': state,
        'bri': parseInt(bri)
      }

      this.$http.put(`${hueUrl}/lights/${this.light.id}/state`, data).then(response => {
        // bubble up to Hue component to refetch the lights
        this.$emit('statechange', {id: this.light.id, state: state})
        this.light.state.bri = bri
      }, response => {
        console.error('Light state change failed')
      })
    }
  }
}
</script>
