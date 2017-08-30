<!--
This file hosts any task/todo list for outlook
In my example I want to use 2 lists, so this component is called once
and creates 2 task lists
-->
<template>
  <div class="taskList">
      <task-list v-if="accessToken"
          v-for="list in lists"
          :accesstoken="accessToken"
          :title="list.title"
          :quicklist="list.quickAdd"
          :clientid="clientid"
          :listid="list.id"
          :key="list.id">
      </task-list>
  </div>
</template>

<script>
/* global Msal:true */
/* eslint no-undef: "error" */
import TaskList from './TaskList'
import Keyboard from '../../components/Keyboard'

export default {
  name: 'mstodo',
  props: ['clientid', 'lists'],
  components: {
    Keyboard,
    TaskList
  },
  created () {
    this.init()
  },
  data () {
    return {
      loading: true,
      userAgentApplication: null,
      idToken: null,
      // accessToken: (localStorage.getItem('access-token')) ? localStorage.getItem('access-token') : null,
      accessToken: null,
      items: [],
      apiRootUrl: 'https://outlook.office.com/'
    }
  },
  methods: {
    init () {
      // const self = this
      this.userAgentApplication = new Msal.UserAgentApplication(this.clientid, null, function (errorDes, token, error, tokenType) {
        // this callback is called after loginRedirect OR acquireTokenRedirect (not used for loginPopup/aquireTokenPopup)
      })
      const user = this.userAgentApplication.getUser()
      if (!user) {
        this.userAgentApplication.loginPopup([`${this.apiRootUrl}Tasks.readwrite`]).then(function (token) {
          console.log(token, 'loginpopup')
          const user = self.userAgentApplication.getUser()
          if (user) {
            self.getSilentToken()
          }
        }, function (error) {
          console.log(error)
        })
      } else {
        this.getSilentToken()
      }
    },
    getSilentToken () {
      const self = this
      this.userAgentApplication.acquireTokenSilent([`${this.apiRootUrl}Tasks.readwrite`]).then(function (token) {
        self.accessToken = token
        console.log(token, 'accesstoken')
      }, (err) => {
        console.log(err)
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
