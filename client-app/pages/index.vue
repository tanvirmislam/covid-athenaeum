<template>
  <div>
    <Globe />
  </div>
</template>

<script>
import Globe from '~/components/globe.vue'

export default {
  components: {
    Globe
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
