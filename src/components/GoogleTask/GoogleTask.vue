<template>
  <div class="taskList">
    <list
      :list="list"
      :key="list.id"
      v-if="signedIn"
      v-for="list in lists"
      ></list>
  </div>
</template>

<script>
/* global gapi */
/* eslint no-undef: "error" */
import List from '../../components/GoogleTask/List'

import {
  tasksApiKey,
  googleClientId
} from '../../config'

export default {
  name: 'g-task',
  props: ['lists'],
  components: {
    List
  },
  data () {
    return {
      signedIn: false,
      apiKey: tasksApiKey,
      taskClientId: googleClientId
    }
  },
  mounted () {
    if (gapi) {
      gapi.load('client', this.start)
    }
  },
  methods: {
    updateSigninStatus (status) {
      if (status) {
        this.signedIn = true
      } else {
        this.signedIn = false
        gapi.auth2.getAuthInstance().signIn()
      }
    },
    start () {
      const that = this
      gapi.client.init({
        'apiKey': this.apiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'],
        'clientId': this.taskClientId,
        'scope': 'https://www.googleapis.com/auth/tasks'
      }).then(function () {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
          gapi.auth2.getAuthInstance().isSignedIn.listen(that.updateSigninStatus())
        }

        that.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
      }, function (reason) {
        console.log('Error: ' + reason)
      })
    }
  }
}
</script>
<style>
.taskList {
  display: flex;
}

.taskList .list {
  width: 50%;
}
</style>
