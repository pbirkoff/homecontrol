<template>
  <div class="taskList">
    <list
      :list="list"
      :key="list.id"
      v-if="signedIn"
      v-for="list in lists"
      ></list>
  </div>
</template>

<script>
/* eslint no-undef: "error" */
import List from '../../components/GoogleTask/List'
export default {
  name: 'g-task',
  props: ['lists'],
  components: {
    List
  },
  data () {
    return {
      signedIn: false
    }
  },
  mounted () {
    this.signedIn = true
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
