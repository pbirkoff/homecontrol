<!--
disables the screen after a set period of time and blacks out the screen
tapping the overlay will disable the overlay until the set period of time is reached anew


The wrapper in app.vue has a clickevent which resets the timer on every click on the screen
-->
<template>
  <div class="overlay" @click.prevent="quitOverlay()" :class="{active: isActive}">
    <datetime class="overlay__datetime"></datetime>
  </div>
</template>

<script>
import Datetime from './Datetime'
import { bus } from '../main'
export default {
  name: 'overlay',
  components: {
    Datetime
  },
  data () {
    return {
      isActive: false,
      timer: null,
      timeoutTime: 180000 // 3 minutes
    }
  },
  mounted () {
    this.startTimer()
    this.init()
  },
  methods: {
    init () {
      bus.$on('overlay:reset', () => {
        this.clearTimeout()
        this.startTimer()
      })
    },
    startTimer () {
      this.timer = setTimeout(() => {
        this.isActive = true
      }, this.timeoutTime)
    },
    quitOverlay () {
      this.isActive = false
      this.clearTimeout()
    },
    clearTimeout () {
      this.timer = clearTimeout(this.timer)
      this.timer = null
    }
  }
}
</script>

<style>
.overlay {
  transition: all 1s ease-in-out;
  position: absolute;
  z-index: 99999;
  width: 100%;
  height: 100%;
  pointer-events: none;
  visibility: none;
}

.overlay .overlay__datetime {
  transition: all 1s ease-in-out;
  opacity: 0;
  pointer-events: none;
  color: #FFF;
  text-align: center;
}

.overlay.active {
  pointer-events: auto;
  background: rgba(0, 0, 0, .9);
  visibility: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay.active .overlay__datetime {
  opacity: 1;
}


</style>
