<template>
  <div class="wunderlist">
    <h1 class="wunderlist__title">Boodschappen</h1>
    <ul v-if="tasks">
      <li v-for="task in tasks" v-if="!task.completed">
        <button @click="checkTask(task)">Klaar</button> {{ task.title }}
      </li>
    </ul>

    <div v-if="showTextAdd">
      <input type="text" v-model="taskText" v-bind:autofocus="showTextAdd">
      <button @click="addTextTask()">Klaar</button>
    </div>
    <button @click="showTextAdd = !showTextAdd">Toevoegen</button>
    <button @click="showQuickAdd = !showQuickAdd">Snel toevoegen</button>
    <ul v-if="showQuickAdd">
      <li><button @click="createTask('Brood')">Brood</button></li>
      <li><button @click="createTask('Melk')">Melk</button></li>
      <li><button @click="createTask('Eten Jilles')">Eten Jilles</button></li>
      <li><button @click="createTask('Luiers')">Luiers</button></li>
      <li><button @click="createTask('Kattenvoer')">Kattenvoer</button></li>
      <li><button @click="createTask('Pindakaas')">Pindakaas</button></li>
      <li><button @click="createTask('WC-papier')">WC-papier</button></li>
    </ul>
  </div>
</template>

<script>
import { wunderListAccessToken, wunderListClientId } from '../../config'
/* eslint no-unused-vars: "error" */
let WunderlistSDK = window.wunderlist.sdk
const wunderlistAPI = new WunderlistSDK({
  'accessToken': wunderListAccessToken,
  'clientID': wunderListClientId
})

export default {
  name: 'wunderlist',
  data () {
    return {
      shoppingListId: 302425877,
      tasks: [],
      showQuickAdd: false,
      showTextAdd: false,
      taskText: ''
    }
  },
  created () {
    this.getTasks()
  },
  methods: {
    addTextTask () {
      this.createTask(this.taskText)
      this.taskText = ''
      this.showTextAdd = false
    },
    createTask (str) {
      const self = this
      wunderlistAPI.http.tasks.create({
        'list_id': this.shoppingListId,
        'title': str
      })
      .done(function (taskData, statusCode) {
        self.tasks.push(taskData)
      })
      .fail(function (resp, code) {
        console.log('Saving task failed')
      })
    },
    checkTask (task) {
      // task.completed = true
      this.updateTask(task, {completed: true})
    },
    updateTask (task, data) {
      wunderlistAPI.http.tasks.update(task.id, task.revision, data).done(function (taskData, statusCode) {
        if (statusCode === 200) {
          // re-set the data in the specified task with the new updated data
          for (const key in data) {
            task[key] = data[key]
          }
        }
      })
      .fail(function (resp, code) {
        console.log('Task not updated')
      })
    },
    getTasks () {
      const self = this
      wunderlistAPI.http.tasks.forList(this.shoppingListId).done(function (listData, status) {
        self.tasks = listData
      })
      .fail(function () {
        console.error('there was a problem')
      })
    }
  }
}
</script>
