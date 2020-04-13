import Vue from 'vue'

Vue.mixin({
  methods: {
    getCommaSeparatedRepr (num) {
      const splitByDecimal = num.toString().split('.')
      return (splitByDecimal.length === 1) ? (num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) : (`${splitByDecimal[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${splitByDecimal[1]}`)
    }
  }
})
