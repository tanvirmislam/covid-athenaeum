import Vue from 'vue'

Vue.mixin({
  methods: {
    getStringRepr (num) {
      if (num == 0) {
        return '---'
      }

      const splitByDecimal = num.toString().split('.')
      return (splitByDecimal.length === 1)
        ? (num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        : (`${splitByDecimal[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${splitByDecimal[1]}`)
    }
  }
})
