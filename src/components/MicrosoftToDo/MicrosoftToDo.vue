<template>
  <div>
    <div v-if="loading === true" class="is--loading">
      <img src="/static/img/preloader.png" alt="loading">
    </div>
    <div v-else>
      <ul v-if="items.length">
        <li v-if="item.Status !== 'Completed'" v-for="item in items">
          <button @click="completeTask(item);">V</button>
          {{ item.Subject }}
        </li>
      </ul>
      <p v-if="!items || items.length === 0">Geen items</p>
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
      loading: true,
      showQuickAdd: false,
      taskSubject: '',
      userAgentApplication: null,
      idToken: null,
      accessToken: (localStorage.getItem('accessToken')) ? localStorage.getItem('accessToken') : null,
      items: [],
      apiRootUrl: 'https://outlook.office.com/',
      groceryTasksUrl: `https://outlook.office.com/api/v2.0/me/taskfolders('${microsoftTasksGroceryListId}')/tasks`
    }
  },
  methods: {
    init () {
      this.userAgentApplication = new Msal.UserAgentApplication(microsoftTasksClientId, null, function (errorDes, token, error, tokenType) {
        // this callback is called after loginRedirect OR acquireTokenRedirect (not used for loginPopup/aquireTokenPopup)
      })
      let user = this.userAgentApplication.getUser()
      if (!user) {
        const self = this
        // this.userAgentApplication = new Msal.UserAgentApplication(microsoftTasksClientId)
        this.userAgentApplication.loginPopup([`${this.apiRootUrl}Tasks.readwrite`]).then(function (token) {
          self.idToken = token
          user = self.userAgentApplication.getUser()
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
        self.getTasks()

        setInterval(self.getTasks, 900000)
      }, function (err) {
        console.log(err)
        self.init()
      })
    },
    getTasks () {
      const header = 'Bearer ' + this.accessToken
      this.$http.get(`${this.groceryTasksUrl}?$top=99`, { headers: { 'Authorization': header } }).then(response => {
        if (response && response.body && response.body.value) {
          this.items = []
          // Only push not-completed items
          response.body.value.forEach(v => {
            if (v.Status !== 'Completed') {
              this.items.push(v)
            }
          })
          this.loading = false
        }
      })
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
      const header = 'Bearer ' + this.accessToken
      this.$http.post(`${this.groceryTasksUrl}`, data, { headers: { 'Authorization': header } }).then(response => {
        if (response.status === 201) {
          this.items.push(response.body)
        }
      })
    },
    completeTask (item) {
      const header = 'Bearer ' + this.accessToken
      // https://outlook.office.com/api/v2.0/me/tasks('{task_id}')/complete
      this.$http.post(`${this.apiRootUrl}api/v2.0/me/tasks('${item.Id}')/complete`, {}, { headers: { 'Authorization': header } }).then(response => {
        console.log(response)
        if (response.status === 200) {
          const itemIndex = this.items.findIndex((arrItem) => {
            return arrItem.Id === item.Id
          })

          if (itemIndex >= 0) {
            this.items.splice(itemIndex, 1)
          }
        }
      })
    }
  }
}
</script>
