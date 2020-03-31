<template>
  <v-navigation-drawer v-model="isSidebarVisible" app floating temporary :width="sidebarWidth">
    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index" :to="item.to" router exact>
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Global Perspective',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },

  computed: {
    isSidebarVisible: {
      get () {
        return this.$store.getters['sidebar/isSidebarVisible']
      },
      set (val) {
        this.setSidebarVisibilityStatus(val)
      }
    },

    sidebarWidth: {
      get () {
        return this.$store.getters['sidebar/sidebarWidth']
      }
    }
  },

  methods: {
    ...mapActions({
      setSidebarVisibilityStatus: 'sidebar/setSidebarVisibilityStatus'
    })
  }
}
</script>
