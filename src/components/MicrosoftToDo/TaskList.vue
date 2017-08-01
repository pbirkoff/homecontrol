<template>
  <div class="list">
    <div v-if="loading === true" class="is--loading">
      <img src="/static/img/preloader.png" alt="loading">
    </div>
    <div v-else>
      <h1>{{ title }}</h1>
      <ul v-if="items.length">
        <li v-if="item.Status !== 'Completed'" v-for="item in items">
          <button @click="completeTask(item);">V</button>
          {{ item.Subject }}
        </li>
      </ul>
      <p v-if="!items || items.length === 0">Geen items</p>
      <button class="btn btn-primary" @click.prevent="keyboardFocus = !keyboardFocus">Handmatig toevoegen</button>
      <keyboard @submitted="keyboardSubmit" :visible="keyboardFocus"></keyboard>
      <button @click="showQuickAdd = !showQuickAdd" class="btn btn-primary">Snel toevoegen</button>
      <ul class="list-unstyled task-quick-add" v-if="showQuickAdd && quicklist.length >= 0">
        <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" v-for="qaItem in quicklist" @click="addTask(qaItem)">{{qaItem}}</button></li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint no-undef: "error" */
import Keyboard from '../../components/Keyboard'
export default {
  name: 'tasklist',
  props: ['accesstoken', 'clientid', 'listid', 'quicklist', 'title'],
  components: {
    Keyboard
  },
  watch: {
    'accesstoken': function (token) {
      this.getTasks()
    }
  },
  created () {
    if (this.accesstoken) {
      this.getTasks()
      setInterval(this.getTasks, 900000)
    }
  },
  data () {
    return {
      keyboardFocus: false,
      loading: true,
      showQuickAdd: false,
      userAgentApplication: null,
      items: [],
      apiRootUrl: 'https://outlook.office.com/',
      folderUrl: `https://outlook.office.com/api/v2.0/me/taskfolders('${this.listid}')/tasks`
    }
  },
  methods: {
    getTasks () {
      const header = 'Bearer ' + this.accesstoken
      this.$http.get(`${this.folderUrl}?$top=99`, { headers: { 'Authorization': header } }).then(response => {
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
    addTask (task) {
      const data = {
        Subject: task
      }
      this.postTask(data)
    },
    postTask (data) {
      const header = 'Bearer ' + this.accesstoken
      this.$http.post(`${this.folderUrl}`, data, { headers: { 'Authorization': header } }).then(response => {
        if (response.status === 201) {
          this.items.push(response.body)
        }
      })
    },
    completeTask (item) {
      const header = 'Bearer ' + this.accesstoken
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
    },
    keyboardSubmit (a) {
      if (a.visible) {
        this.keyboardFocus = true
      } else {
        this.keyboardFocus = false
      }

      if (a.text !== '') {
        this.addTask(a.text)
      }
    }
  }
}
</script>
