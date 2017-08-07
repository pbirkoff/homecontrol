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
      <microsoft-to-do :clientid="microsoftTasksClientId" :lists="todoLists"></microsoft-to-do>
    </div>
  </div>
</template>

<script>
import {
  microsoftTasksClientId,
  todoLists
} from './config'
import Weather from './components/Weather'
import Overlay from './components/Overlay'
import Hue from './components/Hue/Hue'
import MicrosoftToDo from './components/MicrosoftToDo/MicrosoftToDo'
import { bus } from './main'

export default {
  name: 'app',
  components: {
    Weather,
    Hue,
    MicrosoftToDo,
    Overlay
  },
  data () {
    return {
      todoLists,
      microsoftTasksClientId,
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

