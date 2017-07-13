<template>
  <div id="app">
    <weather></weather>
    <wunderlist></wunderlist>
    <hue></hue>
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
