<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="toggle()" />
    <v-toolbar-title v-text="title" />
    <v-spacer />
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      title: 'Covid Atheneaum'
    }
  },

  methods: {
    ...mapActions({
      toggle: 'sidebar/toggleSidebar'
    })
  }
}
</script>
