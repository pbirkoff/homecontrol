<template>
  <div class="datetime">
    <div class="datetime__date">
      {{ date }}
    </div>
    <div class="datetime__time" v-html="time"></div>
  </div>
</template>

<script>

export default {
  name: 'datetime',
  data () {
    return {
      date: '',
      hours: '',
      minutes: ''
    }
  },
  computed: {
    time () {
      return `${this.hours}<span class="datetime__colon">:</span>${this.minutes}`
    }
  },
  created () {
    setInterval(this.updateDateTime, 1000)
  },
  methods: {
    updateDateTime () {
      let now = new Date()

      const day = now.getDate()
      let month = now.getMonth() + 1

      this.date = `${day} ${this.dutchMonthName(month)}`

      this.hours = this.prefix(now.getHours())
      this.minutes = this.prefix(now.getMinutes())
      this.hourtime = this.hours
    },
    prefix (n) {
      return (parseInt(n, 10) >= 10 ? '' : '0') + n
    },
    dutchMonthName (m) {
      switch (m) {
        case 1:
          return 'jan'

        case 2:
          return 'feb'

        case 3:
          return 'mrt'

        case 4:
          return 'apr'

        case 5:
          return 'mei'

        case 6:
          return 'jun'

        case 7:
          return 'jul'

        case 8:
          return 'augu'

        case 9:
          return 'sept'

        case 10:
          return 'okt'

        case 11:
          return 'nov'

        case 12:
          return 'dec'

      }
    }
  }
}
</script>
