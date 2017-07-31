<template>
  <div id="app" class="dashboard">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.Subject }}
      </li>
    </ul>
  </div>
</template>

<script>
/* global Msal:true */
/* eslint no-undef: "error" */
import { microsoftTasksClientId, microsoftTasksGroceryListId } from '../../config'
export default {
  name: 'mstodo',
  created () {
    this.init()
  },
  data () {
    return {
      userAgentApplication: null,
      token: (localStorage.getItem('token')) ? localStorage.getItem('token') : null,
      items: []
    }
  },
  methods: {
    init () {
      if (!this.token) {
        const self = this
        // this.userAgentApplication = new Msal.UserAgentApplication(microsoftTasksClientId)
        this.userAgentApplication = new Msal.UserAgentApplication(microsoftTasksClientId, null, function (errorDes, token, error, tokenType) {
          // this callback is called after loginRedirect OR acquireTokenRedirect (not used for loginPopup/aquireTokenPopup)
        })

        if (!this.token) {
          this.userAgentApplication.loginPopup(['https://outlook.office.com/Tasks.readwrite']).then(function (token) {
            let user = self.userAgentApplication.getUser()
            self.token2 = token
            if (user) {
              self.getSilentToken()
            }
          }, function (error) {
            console.log(error)
          })
        } else {
          this.getSilentToken()
        }
      } else {
        this.getTasks()
      }
    },
    getSilentToken () {
      const self = this
      this.userAgentApplication.acquireTokenSilent(['https://outlook.office.com/Tasks.readwrite']).then(function (token) {
        console.log('ATS promise resolved', token)
        self.token = token
        localStorage.setItem('token', token)
        self.getTasks()
      })
    },
    getTasks () {
      const header = 'Bearer ' + this.token
      this.$http.get(`https://outlook.office.com/api/v2.0/me/taskfolders('${microsoftTasksGroceryListId}')/tasks`, { headers: { 'Authorization': header } }).then(response => {
        if (response && response.body && response.body.value) {
          this.items = response.body.value
        }
      })

      setInterval(() => {
        const header = 'Bearer ' + this.token
        this.$http.get(`https://outlook.office.com/api/v2.0/me/taskfolders('${microsoftTasksGroceryListId}')/tasks`, { headers: { 'Authorization': header } }).then(response => {
          if (response && response.body && response.body.value) {
            this.items = response.body.value
          }
        })
      }, 900000)
    }
  }
}
</script>
