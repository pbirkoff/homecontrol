<template>
  <div id="app" class="dashboard">
    mstodo
  </div>
</template>

<script>
/* global Msal:true */
/* eslint no-undef: "error" */
export default {
  name: 'mstodo',
  created () {
    this.init()
  },
  data () {
    return {
      clientID: 'e49e3c0c-cc83-4250-aff2-868439026935',
      redirectUri: '',
      userAgentApplication: null,
      token: null
    }
  },
  methods: {
    init () {
      const self = this
      // this.userAgentApplication = new Msal.UserAgentApplication(this.clientID)
      this.userAgentApplication = new Msal.UserAgentApplication(this.clientID, null, function (errorDes, token, error, tokenType) {
        // this callback is called after loginRedirect OR acquireTokenRedirect (not used for loginPopup/aquireTokenPopup)
        console.log('acquire token?')
      })

      this.userAgentApplication.loginPopup(['Tasks.read']).then(function (token) {
        let user = self.userAgentApplication.getUser()
        if (user) {
          self.token = token
          console.log('ssuccess')
          self.getTasks()
        }
        console.log('below if')
      }, function (error) {
        // handle error
        console.log(error)
      })
    },
    getTasks () {
      const header = 'Bearer ' + this.token
      this.$http.headers.common['Authorization'] = header
      console.log(header)
      this.$http.get('https://graph.microsoft.com/v1.0/me').then(response => {
        console.log(response)
      })
    }
  }
}
</script>
