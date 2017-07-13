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
          return 'januari'

        case 2:
          return 'februari'

        case 3:
          return 'maart'

        case 4:
          return 'april'

        case 5:
          return 'mei'

        case 6:
          return 'juni'

        case 7:
          return 'juli'

        case 8:
          return 'augustus'

        case 9:
          return 'september'

        case 10:
          return 'oktober'

        case 11:
          return 'november'

        case 12:
          return 'december'

      }
    }
  }
}
</script>
