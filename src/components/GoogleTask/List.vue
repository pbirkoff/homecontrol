<template>
  <div class="list">
    <div class="header">
      <h1 style="display: inline-block; margin-right: 1rem;">{{ list.title }}</h1>
      <a style="display: inline-block; width: 20px; height: 20px;" href="#" @click.prevent="showQuickAdd = !showQuickAdd">
        <i class="fa fa-plus"></i>
      </a>
      <a style="display: inline-block; width: 20px; height: 20px;" href="#" @click.prevent="keyboardFocus = !keyboardFocus">
        <i class="fa fa-plus-square"></i>
      </a>
    </div>
      <div v-if="loading === true">
        <div class="loader" :class="{ 'is--active' : loading }"></div>
      </div>
      <div v-else class="list-scroller">
          <ul class="checklist">
            <li v-if="item.status === 'needsAction' && item.title !== ''" :class="{ 'is-checked': item.checked }" v-for="item in items" @click="removeTask(item);">
              <i class="icon ion-checkmark-round"></i>
              <span>{{ item.title }}</span>
            </li>
            <li v-if="!items || items.length === 0">Geen items</li>
          </ul>
          <keyboard @submitted="keyboardSubmit" :visible="keyboardFocus"></keyboard>
          <ul class="list-unstyled task-quick-add" v-if="showQuickAdd && list.quickAdd.length >= 0">
            <li>
              <a href="" style="color: black; float: right; padding: 1rem 0 1rem 1rem;" @click.prevent="showQuickAdd = !showQuickAdd">
                <i class="fa fa-times"></i>
              </a>
            </li>
            <li class="task-quick-add__item"><button class="btn btn-secondary btn-block" v-for="qaItem in list.quickAdd" @click="addTask(qaItem); showQuickAdd = false;">{{qaItem}}</button></li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
/* global gapi */
import Keyboard from '../../components/Keyboard'
export default {
  name: 'g-task-list',
  props: ['list'],
  components: {
    Keyboard
  },
  data () {
    return {
      items: [],
      taskSaving: false,
      keyboardFocus: false,
      loading: true,
      showQuickAdd: false
    }
  },
  mounted () {
    if (gapi) {
      gapi.load('client', this.getTasks)
      setInterval(this.getTasks, 900000)

      /* ****** RUN THIS METHOD TO GET YOUR LIST IDS NEEDED IN CONFIG ******* */
      this.getLists()
    }
  },
  methods: {
    getLists () {
      gapi.client.request({
        'path': `/tasks/v1/users/@me/lists`,
        'callback': function (r) {
          if (r) {
            console.log('THESE ARE YOUR LISTS AND IDS:')
            for (let i in r.items) {
              console.log(`${r.items[i].title} - ${r.items[i].id}`)
            }
            console.log('')
            console.log('')
            console.log('')
          }
        }
      })
    },
    getTasks () {
      this.loading = true
      this.items = []
      const that = this
      gapi.client.request({
        'path': `/tasks/v1/lists/${this.list.id}/tasks`,
        'callback': function (r) {
          if (r && r.items && r.items.length) {
            r.items.forEach((item) => {
              if (item.status !== 'completed') {
                that.addItem(item)
              }

              that.loading = false
            })
          }
        }
      })
    },
    removeTask (task) {
      const that = this
      gapi.client.request({
        'path': `/tasks/v1/lists/${this.list.id}/tasks/${task.id}`,
        method: 'DELETE',
        callback: function () {
          const itemIndex = that.items.findIndex((arrItem) => {
            return arrItem.id === task.id
          })

          // Wait a while before actually removing the item to make it animate
          task.checked = true
          setTimeout(() => {
            task.checked = false

            if (itemIndex >= 0) {
              that.items.splice(itemIndex, 1)
            }
          }, 900)
        }
      })
    },
    addTask (task) {
      const that = this

      this.taskSaving = true
      const data = {
        title: task
      }

      gapi.client.request({
        'path': `/tasks/v1/lists/${this.list.id}/tasks/`,
        'method': 'POST',
        'body': data
      }).then(function (resp) {
        if (resp && resp.status === 200 && resp.result) {
          that.addItem(resp.result)
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
    },
    addItem (item) {
      const {title, status, id} = item
      const newItem = {
        title,
        status,
        id,
        checked: false,
        originalTask: item
      }

      this.items.push(newItem)
    }
  }
}
</script>
