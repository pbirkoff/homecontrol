<template>
  <div id="app" class="dashboard">
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
import Hue from './components/Hue/Hue'
import MicrosoftToDo from './components/MicrosoftToDo/MicrosoftToDo'

export default {
  name: 'app',
  components: {
    Weather,
    Hue,
    MicrosoftToDo
  },
  data () {
    return {
      todoLists,
      microsoftTasksClientId
    }
  }
}
</script>

