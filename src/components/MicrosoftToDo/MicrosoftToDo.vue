<template>
  <div id="app" class="dashboard">
    <ul v-if="items.length">
      <li v-if="item.Status !== 'Completed'" v-for="item in items">
        <button @click="completeTask(item);">V</button>
        {{ item.Subject }}
      </li>
    </ul>
    <input type="text" v-model="taskSubject">
    <button @click="submitTask()">Add</button>

    <button @click="showQuickAdd = !showQuickAdd" class="btn btn-primary">Snel toevoegen</button>
    <ul class="list-unstyled task-quick-add" v-if="showQuickAdd">
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('Brood')">Brood</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('Melk')">Melk</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('Eten Jilles')">Eten Jilles</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('Luiers')">Luiers</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('Kattenvoer')">Kattenvoer</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('Pindakaas')">Pindakaas</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="addTask('WC-papier')">WC-papier</button></li>
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
      showQuickAdd: false,
      taskSubject: '',
      userAgentApplication: null,
      token: (localStorage.getItem('token')) ? localStorage.getItem('token') : null,
      items: [],
      apiRootUrl: 'https://outlook.office.com/',
      groceryTasksUrl: `https://outlook.office.com/api/v2.0/me/taskfolders('${microsoftTasksGroceryListId}')/tasks`
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
          this.userAgentApplication.loginPopup([`${this.apiRootUrl}Tasks.readwrite`]).then(function (token) {
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
      this.userAgentApplication.acquireTokenSilent([`${this.apiRootUrl}Tasks.readwrite`]).then(function (token) {
        console.log('ATS promise resolved', token)
        self.token = token
        localStorage.setItem('token', token)
        self.getTasks()
      })
    },
    getTasks () {
      const header = 'Bearer ' + this.token
      this.$http.get(`${this.groceryTasksUrl}`, { headers: { 'Authorization': header } }).then(response => {
        if (response && response.body && response.body.value) {
          this.items = response.body.value
        }
      })

      setInterval(() => {
        const header = 'Bearer ' + this.token
        this.$http.get(`${this.groceryTasksUrl}`, { headers: { 'Authorization': header } }).then(response => {
          if (response && response.body && response.body.value) {
            this.items = response.body.value
          }
        })
      }, 900000)
    },
    submitTask () {
      this.addTask(this.taskSubject)
      this.taskSubject = ''
    },
    addTask (task) {
      const data = {
        Subject: task
      }
      this.postTask(data)
    },
    postTask (data) {
      const header = 'Bearer ' + this.token
      this.$http.post(`${this.groceryTasksUrl}`, data, { headers: { 'Authorization': header } }).then(response => {
        if (response.status === 201) {
          this.items.push(response.body)
        }
      })
    },
    completeTask (item) {
      const header = 'Bearer ' + this.token
      this.$http.post(`${this.apiRootUrl}me/tasks('${item.Id}')/complete`, { headers: { 'Authorization': header } }).then(response => {
        console.log(response)
      })
    }
  }
}
</script>
