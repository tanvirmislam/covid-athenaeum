<template>
  <v-footer app>
    <span class="caption mr-2">&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      fixed: false
    }
  },

  computed: {
    isSidebarVisible: {
      get () {
        return this.$store.getters['sidebar/isSidebarVisible']
      }
    }
  }
}
</script>
