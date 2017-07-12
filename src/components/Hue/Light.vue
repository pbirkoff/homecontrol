<template>
  <div class="lights-group__item">
    <h2 class="lights-group__item-title">{{ light.name }}</h2>
    <span class="" :class="stateClass">{{ stateText }}</span>
    <button @click="changeState(!light.state.on)">Aan/uit</button>
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
    }
  },
  data () {
    return {
      poop: ''
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
    changeState (state) {
      const data = {
        on: state,
        bri: 255
      }

      this.$http.put(`${hueUrl}/lights/${this.light.id}/state`, data).then(response => {
        // bubble up to Hue component to refetch the lights
        this.$emit('statechange', {id: this.light.id, state: state})
      }, response => {
        console.error('Light state change failed')
      })
    }
  }
}
</script>
