<template>
  <div>
    <globe />
  </div>
</template>

<script>
import globe from '~/components/globe.vue'

export default {
  components: {
    globe
  },

  data () {
    return {
      title: 'Covid Athenaeum'
    }
  },

  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: 'Learn about COVID-19' }
      ]
    }
  }
}
</script>

<style>
#globeComponentContainer {
  height: 100%;
  width: 100%;
}
</style>
