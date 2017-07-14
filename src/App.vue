<template>
  <div id="app" class="dashboard">
    <div class="tile tile-weather">
      <weather></weather>
    </div>

    <div class="tile tile-wunderlist">
      <wunderlist></wunderlist>
    </div>

    <div class="tile tile-hue">
      <hue></hue>
    </div>

    <div class="tile tile-filler">
      <h1>Ik heb hier nog niks voor...</h1>
    </div>
  </div>
</template>

<script>
import Weather from './components/Weather'
import Hue from './components/Hue/Hue'
import Wunderlist from './components/Wunderlist/Wunderlist'

export default {
  name: 'app',
  components: {
    Weather,
    Hue,
    Wunderlist
  }
}
</script>
