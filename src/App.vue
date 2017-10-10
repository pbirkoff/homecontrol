<template>
  <div id="app" class="dashboard" @click="appClicked()">
    <overlay :running="overlayTimerRunning"></overlay>
    <div class="tile tile-weather">
      <weather></weather>
    </div>

    <div class="tile tile-bottom-right">
      <google-calendar v-if="signedInToGoogle && !showHue"></google-calendar>
    </div>

    <div class="tile tile-filler">
      <google-task :lists="todoLists" v-if="signedInToGoogle"></google-task>
    </div>

    <div class="tile tile-bottom-bar">
      <a class="hueModalToggle" href="#" @click.prevent="openHueModal">
        <i class="fa fa-2x fa-lightbulb-o"></i>
      </a>
      <crypto-rate fsym="ETH"></crypto-rate>
      <crypto-rate fsym="WAVES"></crypto-rate>
    </div>

    <div class="modal fade" ref="hueModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Hue lichten</h2>
          </div>
          <div class="modal-body">
            <hue></hue>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Sluiten</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global jQuery */
import {
  googleClientId,
  tasksApiKey,
  todoLists
} from './config'
import CryptoRate from './components/CryptoRate'
import Weather from './components/Weather'
import Overlay from './components/Overlay'
import Hue from './components/Hue/Hue'
import GoogleTask from './components/GoogleTask/GoogleTask'
import GoogleCalendar from './components/GoogleCalendar/GoogleCalendar'
import { bus } from './main'

/* global gapi */
export default {
  name: 'app',
  components: {
    Weather,
    Hue,
    GoogleTask,
    GoogleCalendar,
    Overlay,
    CryptoRate
  },
  data () {
    return {
      showHue: false,
      todoLists,
      googleClientId,
      tasksApiKey,
      overlayTimerRunning: true,
      signedInToGoogle: false
    }
  },
  mounted () {
    if (gapi) {
      // in order to access the calendar and tasks authenticate google once in here so we can use it elsewhere
      gapi.load('client', this.authenticateGoogle)
    }
  },
  methods: {
    openHueModal () {
      jQuery(this.$refs.hueModal).modal('show')
    },
    updateSigninStatus (status) {
      if (status) {
        this.signedInToGoogle = true
      } else {
        this.signedInToGoogle = false
        gapi.auth2.getAuthInstance().signIn()
      }
    },
    authenticateGoogle () {
      const that = this
      gapi.client.init({
        'apiKey': this.tasksApiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest', 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'],
        'clientId': this.googleClientId,
        'scope': 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks'
      }).then(function () {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
          gapi.auth2.getAuthInstance().isSignedIn.listen(that.updateSigninStatus())
        }

        that.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
      }, function (reason) {
        console.log('Error: ' + reason)
      })
    },
    appClicked () {
      // if the app is clicked anywhere, the timer for the overlay should be reset.
      bus.$emit('overlay:reset')
    }
  }
}
</script>

