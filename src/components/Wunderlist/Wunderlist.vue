<template>
  <div class="wunderlist">
    <h1 class="wunderlist__title">Boodschappen</h1>
    <ol v-if="tasks" class="task-list">
      <li class="task-list__item" v-for="task in tasks" v-if="!task.completed">
        {{ task.title }}
        <button @click="checkTask(task)" class="task-list__item-btn-finalize">
          <i class="fa fa-check"></i>
        </button>
      </li>
    </ol>

    <div v-if="showTextAdd">
      <form @submit="addTextTask()" class="form-inline task-add">
        <div class="form-group">
          <input type="text" v-model="taskText" class="form-control" v-bind:autofocus="showTextAdd">
          <button @click="addTextTask()" class="btn task-add__btn-add"><i class="fa fa-arrow-right"></i></button>
        </div>
      </form>
    </div>
    <button @click="showTextAdd = !showTextAdd" class="btn btn-primary">Toevoegen</button>
    <button @click="showQuickAdd = !showQuickAdd" class="btn btn-primary">Snel toevoegen</button>
    <ul class="list-unstyled task-quick-add" v-if="showQuickAdd">
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('Brood')">Brood</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('Melk')">Melk</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('Eten Jilles')">Eten Jilles</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('Luiers')">Luiers</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('Kattenvoer')">Kattenvoer</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('Pindakaas')">Pindakaas</button></li>
      <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" @click="createTask('WC-papier')">WC-papier</button></li>
    </ul>
  </div>
</template>

<script>
import { wunderListAccessToken, wunderListClientId, wunderListListId } from '../../config'
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
      shoppingListId: wunderListListId,
      tasks: [],
      showQuickAdd: false,
      showTextAdd: false,
      taskText: ''
    }
  },
  created () {
    this.getTasks()

    // recheck tasks every 15 minutes
    setInterval(this.getTasks, 900000)
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
