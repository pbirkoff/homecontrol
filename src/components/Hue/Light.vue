<template>
  <div class="lights-group__item">
    <div class="lights-group__item-title">
      <span>{{ light.name }}</span>
      <i class="fa fa-times text--danger" v-if="!light.state.reachable"></i>
      <button v-else @click="changeState(!light.state.on)" class="btn btn-switch" :class="stateClass"></button>
    </div>
  </div>
</template>

<script>
import { hueUrl } from '../../config'
export default {
  name: 'hue-light',
  props: ['light', 'state'],
  watch: {
    'state': function (s) {
      // this.changeState(s)
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
      let cls = ''
      if (this.light.state.on) {
        cls += 'is--active'
      }

      if (!this.light.state.reachable) {
        cls += 'is--unreachable'
      }

      return cls
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
