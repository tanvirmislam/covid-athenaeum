<template>
  <v-app dark>
    <Sidebar />
    <Appbar />

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Sidebar from './sidebar'
import Appbar from './appbar'
import Footer from './footer'

export default {
  components: {
    Sidebar,
    Appbar,
    Footer
  }
}
</script>

<style >
#nuxtComponentContainer {
  height: 100%;
  width: 100%;
}
</style>
