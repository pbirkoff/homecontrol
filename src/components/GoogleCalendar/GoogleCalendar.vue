<template>
  <div v-if="loading === true">
    <div class="loader" :class="{ 'is--active' : loading }"></div>
  </div>
  <div v-else class="calendar-list-holder">
    <ul class="calendar-list">
      <li v-for="item in sortedItems" class="calendar-list__item" :class="creatorClass(item.creatorName)">
        <section class="item">
          <div class="datetime">
            <div class="datetime__date" v-html="item.startDate"></div>
            <div class="datetime__time">
              {{ item.startTime }}
            </div>
          </div>
          <div class="description">{{ item.summary }}</div>
          <img src="/static/img/timen.jpg" class="avatar avatar-tengwerda">
          <img src="/static/img/ali.jpg" class="avatar avatar-alilaanstra">
        </section>
      </li>
    </ul>
  </div>
</template>

<script>
/* global gapi */
/* eslint no-undef: "error" */

import {
  tasksApiKey,
  googleClientId
} from '../../config'

export default {
  name: 'g-cal',
  data () {
    return {
      apiKey: tasksApiKey,
      taskClientId: googleClientId,
      items: [],
      loading: true
    }
  },
  mounted () {
    this.refreshItems()
    setInterval(this.refreshItems, 900000)
  },
  computed: {
    sortedItems () {
      return this.sortByKey(this.items, 'timestampStart')
    }
  },
  methods: {
    refreshItems () {
      this.items = []
      this.getItems()
      this.getItems('alilaanstra@gmail.com')
    },
    getItems (calId = 'primary') {
      this.loading = true
      const that = this
      gapi.client.calendar.events.list({
        'calendarId': calId,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 5,
        'orderBy': 'startTime'
      }).then(function (response) {
        that.addEvents(response.result.items)
        that.loading = false
      })
    },
    addEvents (events) {
      events.forEach((event) => {
        const creatorName = this.getCreatorName(event)

        let start = event.start.date
        let end = event.end.date
        let wholeDay = true

        if (event.start.dateTime) {
          start = event.start.dateTime
          wholeDay = false
        }

        if (event.start.dateTime) {
          end = event.end.dateTime
          wholeDay = false
        }

        const obj = {
          startDate: this.makeDate(start),
          endDate: this.makeDate(end),
          startTime: this.makeTime(start, wholeDay),
          endTime: this.makeTime(end, wholeDay),
          summary: event.summary,
          creatorName,
          timestampStart: new Date(start).getTime()
        }

        this.items.push(obj)
      })
    },
    makeDate (d) {
      let now = new Date(d)

      const day = now.getDate()
      let month = now.getMonth() + 1

      let date = `${day} <br> ${this.dutchMonthName(month)}`

      return date
    },
    makeTime (d, wholeDay) {
      // if its the whole day, dont show the time
      if (wholeDay) {
        return ''
      }

      let now = new Date(d)
      let hours = this.prefix(now.getHours())
      let minutes = this.prefix(now.getMinutes())

      return `${hours}:${minutes} uur`
    },
    creatorClass (author) {
      return `author-${author}`
    },
    getCreatorName (event) {
      const creator = event.creator.email
      if (creator) {
        return creator.substr(0, creator.indexOf('@'))
      }

      return ''
    },
    sortByKey (array, key) {
      return array.sort(function (a, b) {
        const x = a[key]
        const y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
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
