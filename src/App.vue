<template>
  <div id="app" class="dashboard" @click="appClicked()">
    <overlay :running="overlayTimerRunning"></overlay>
    <div class="tile tile-weather">
      <weather></weather>
    </div>

    <div class="tile tile-hue">
      <hue></hue>
    </div>

    <div class="tile tile-filler">
      <google-task :lists="todoLists"></google-task>
    </div>
  </div>
</template>

<script>
import {
  googleClientId,
  tasksApiKey,
  todoLists
} from './config'
import Weather from './components/Weather'
import Overlay from './components/Overlay'
import Hue from './components/Hue/Hue'
import GoogleTask from './components/GoogleTask/GoogleTask'
import { bus } from './main'

export default {
  name: 'app',
  components: {
    Weather,
    Hue,
    GoogleTask,
    Overlay
  },
  data () {
    return {
      todoLists,
      googleClientId,
      tasksApiKey,
      overlayTimerRunning: true
    }
  },
  methods: {
    appClicked () {
      // if the app is clicked anywhere, the timer for the overlay should be reset.
      bus.$emit('overlay:reset')
    }
  }
}
</script>

