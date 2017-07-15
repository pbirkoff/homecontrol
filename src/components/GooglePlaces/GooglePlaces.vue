<template>
  <div class="google_places">
    {{storename}}
    {{open_time}}
    {{open_now}}
    {{close_time}}
  </div>
</template>

<script>
import { googleplacesToken, googleplacesPlace } from '../../config'

export default {
  name: 'googleplaces',
  data () {
    return {
      storename: '',
      open_time: '',
      open_now: 1,
      close_time: '',
      currentDay: new Date().getDay()
    }
  },
  created () {
    this.getStoreInformation()
  },
  methods: {
    getStoreInformation () {
      this.$http.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${googleplacesPlace}&key=${googleplacesToken}`).then(response => {
        // console.log(response.body.result)
        if (response) {
          this.storename = response.body.result.name
          this.open_now = response.body.result.opening_hours.open_now
          this.open_time = response.body.result.opening_hours.periods[this.currentDay].open.time
          this.close_time = response.body.result.opening_hours.periods[this.currentDay].close.time
        }
      }, response => {})
    }
  }
}
</script>
