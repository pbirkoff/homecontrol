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
      token: null,
      token2: null
      // token: (localStorage.getItem('token')) ? localStorage.getItem('token') : null
    }
  },
  methods: {
    init () {
      if (!this.token) {
        const self = this
        // this.userAgentApplication = new Msal.UserAgentApplication(this.clientID)
        this.userAgentApplication = new Msal.UserAgentApplication(this.clientID, null, function (errorDes, token, error, tokenType) {
          // this callback is called after loginRedirect OR acquireTokenRedirect (not used for loginPopup/aquireTokenPopup)
        })

        this.userAgentApplication.loginPopup(['https://outlook.office.com/Tasks.readwrite']).then(function (token) {
          let user = self.userAgentApplication.getUser()
          console.log(token)
          self.token2 = token
          if (user) {
            self.userAgentApplication.acquireTokenSilent(['https://outlook.office.com/Tasks.readwrite']).then(function (token) {
              console.log('ATS promise resolved', token)
              self.token = token
              localStorage.setItem('token', token)
              self.getTasks()
              // self.getTasks2()
            })
          }
        }, function (error) {
          console.log(error)
        })
      } else {
        this.getTasks()
      }
    },
    getTasks () {
      const bearer = 'Bearer ' + this.token
      let headers = new Headers()
      headers.append('Authorization', bearer)
      let options = {
        method: 'GET',
        headers: headers
      }

      // Note that fetch API is not available in all browsers
      fetch('https://outlook.office.com/api/v2.0/me/tasks', options).then(function (response) {
        let contentType = response.headers.get('content-type')
        if (response.status === 200 && contentType && contentType.indexOf('application/json') !== -1) {
          response.json().then(function (data) {
            console.log(data)
          })
          .catch(function (error) {
            console.log(error)
          })
        } else {
          response.json().then(function (data) {
            console.log(data)
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    getTasks2 () {
      const bearer = 'Bearer ' + this.token2
      let headers = new Headers()
      headers.append('Authorization', bearer)
      let options = {
        method: 'GET',
        headers: headers
      }

      // Note that fetch API is not available in all browsers
      fetch('https://graph.microsoft.com/beta/users/me/outlook/tasks', options).then(function (response) {
        let contentType = response.headers.get('content-type')
        if (response.status === 200 && contentType && contentType.indexOf('application/json') !== -1) {
          response.json().then(function (data) {
            console.log(data)
          })
          .catch(function (error) {
            console.log(error)
          })
        } else {
          response.json().then(function (data) {
            console.log(data)
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>
