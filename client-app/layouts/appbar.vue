<template>
  <v-app-bar app>
    <v-btn fab small depressed class="ml-2 mr-5" @click.stop="toggle()">
      <span class="ml-5 mr-5 headline"> <font-awesome-icon :icon="['fas', 'flask']" /> </span>
    </v-btn>
    <v-toolbar-title v-text="title" />
    <v-spacer />
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      title: 'Covid Athenaeum'
    }
  },

  methods: {
    ...mapActions({
      toggle: 'sidebar/toggleSidebar'
    })
  }
}
</script>
