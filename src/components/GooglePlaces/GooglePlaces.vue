<template>
  <div class="google-places">
    <div v-if="stores" class="store-list">
      <div class="store-list__item" v-for="store in stores">
        {{ store.name }}
        {{ store.openNow }}
        {{ store.openTime }}
        {{ store.closeTime }}
      </div>
    </div>
  </div>
</template>

<script>
import { googleplacesToken, googleplacesPlace } from '../../config'

export default {
  name: 'googleplaces',
  data () {
    return {
      stores: [],
      currentDay: new Date().getDay()
    }
  },
  created () {
    this.getStoreInformation()
  },
  methods: {
    getStoreInformation () {
      this.$http.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${googleplacesPlace}&key=${googleplacesToken}`).then(response => {
        if (response) {
          var store = []
          store['name'] = response.body.result.name
          store['openNow'] = response.body.result.opening_hours.open_now
          store['openTime'] = this.formatStoreTime(response.body.result.opening_hours.periods[this.currentDay].open.time)
          store['closeTime'] = this.formatStoreTime(response.body.result.opening_hours.periods[this.currentDay].close.time)
          this.stores.push(store)
        }
      }, response => {
        console.log('Google Places API returned no data.. check the key')
      })
    },
    // Google gives us times without : which is stupid!
    formatStoreTime (time) {
      return time.slice(0, 2) + ':' + time.slice(2)
    }
  }
}
</script>
