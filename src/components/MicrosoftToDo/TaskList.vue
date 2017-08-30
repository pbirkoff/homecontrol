<template>
  <div class="list">
    <div v-if="loading === true" class="is--loading">
      <img src="/static/img/preloader.png" alt="loading">
    </div>
    <div v-else>
      <h1>{{ title }}</h1>
      <ul class="checklist" v-if="items.length">
        <li v-if="item.Status !== 'Completed'" :class="{ 'is-checked': item.checked }" v-for="item in items" @click="completeTask(item);">
          <i class="icon ion-checkmark-round"></i>
          <span>{{ item.Subject }}</span>
        </li>
      </ul>

      <p v-if="!items || items.length === 0">Geen items</p>
      <div class="button-group mt-2">
        <button class="btn btn-primary" @click.prevent="keyboardFocus = !keyboardFocus">Handmatig toevoegen</button>
        <button @click="showQuickAdd = !showQuickAdd" class="btn btn-primary">Snel toevoegen</button>
      </div>
      <keyboard @submitted="keyboardSubmit" :visible="keyboardFocus"></keyboard>
      <ul class="list-unstyled task-quick-add" v-if="showQuickAdd && quicklist.length >= 0">
        <li>
          <a href="" style="color: black; float: right; padding: 1rem 0 1rem 1rem;" @click.prevent="showQuickAdd = !showQuickAdd">
            <i class="fa fa-times"></i>
          </a>
        </li>
        <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" v-for="qaItem in quicklist" @click="addTask(qaItem); showQuickAdd = false;">{{qaItem}}</button></li>
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
      taskSaving: false,
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
              v.checked = false
              this.items.push(v)
            }
          })
          this.loading = false
        }
      })
    },
    addTask (task) {
      this.taskSaving = true
      const data = {
        Subject: task
      }
      this.postTask(data)
    },
    postTask (data) {
      const header = 'Bearer ' + this.accesstoken
      this.$http.post(`${this.folderUrl}`, data, { headers: { 'Authorization': header } }).then(response => {
        if (response.status === 201) {
          response.body.checked = false
          this.items.push(response.body)
        }
        this.taskSaving = false
      })
    },
    completeTask (item) {
      this.taskSaving = true
      const header = 'Bearer ' + this.accesstoken
      this.$http.post(`${this.apiRootUrl}api/v2.0/me/tasks('${item.Id}')/complete`, {}, { headers: { 'Authorization': header } }).then(response => {
        this.taskSaving = false
        if (response.status === 200) {
          const itemIndex = this.items.findIndex((arrItem) => {
            return arrItem.Id === item.Id
          })

          // Wait a while before actually removing the item to make it animate
          item.checked = true
          setTimeout(() => {
            item.checked = false

            if (itemIndex >= 0) {
              this.items.splice(itemIndex, 1)
            }
          }, 900)
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
