<template>
  <div class="rate" v-if="rate">
    {{ fsym }}: &euro; {{ rate }}
  </div>
</template>

<script>
export default {
  name: 'crypto-rate',
  props: ['fsym'],
  data () {
    return {
      rate: false
    }
  },
  mounted () {
    this.getRate()
    setInterval(this.getRate, 900000)
  },
  methods: {
    getRate () {
      this.rate = false
      this.$http.get(`https://min-api.cryptocompare.com/data/price?fsym=${this.fsym}&tsyms=EUR`).then(response => {
        if (response.body && response.body.EUR) {
          this.rate = response.body.EUR
        }
      }, response => {
        console.error('Rate not found')
      })
    }
  }
}
</script>
