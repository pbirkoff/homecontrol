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
          console.log('acquire token?')
        })

        this.userAgentApplication.loginPopup(['Tasks.readwrite']).then(function (token) {
          let user = self.userAgentApplication.getUser()
          if (user) {
            self.token = token
            localStorage.setItem('token', token)
            self.getTasks()
          }
          console.log('below if')
        }, function (error) {
          // handle error
          console.log(error)
        })
      } else {
        this.getTasks()
      }
    },
    getTasks () {
      // // this.$http.headers.common['Authorization'] = header
      // console.log(header)
      // this.$http.get('https://outlook.office.com/api/v2.0/me/tasks', { headers: { 'Authorization': header } }).then(response => {
      //   console.log(response)
      // })
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
    }
  }
}
</script>
