<template>
  <div id="app">
    <weather></weather>
    <hue></hue>
  </div>
</template>

<script>
import Weather from './components/Weather'
import Hue from './components/Hue/Hue'

export default {
  name: 'app',
  components: {
    Weather,
    Hue
  }
}
</script>
