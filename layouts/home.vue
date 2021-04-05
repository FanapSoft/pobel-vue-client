<template>
  <v-app class="app">
<!--    <v-app-bar
      fixed
      app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>-->
    <top-bar-home></top-bar-home>
    <main class="wrapper">

        <nuxt />
    </main>
    <Footer></Footer>
<!--    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import TopBarHome from "../components/TopBarHome";
import Footer from "../components/Footer";

import directionality from "~/mixins/directionality"

export default {
  components: {Footer, TopBarHome},
  mixins: [directionality],
  data () {
    return {
      // clipped: false,
      // drawer: false,
      // fixed: false,
      // items: [
      //   {
      //     icon: 'mdi-apps',
      //     title: 'Welcome jkj',
      //     to: '/'
      //   },
      //   {
      //     icon: 'mdi-chart-bubble',
      //     title: 'Inspire',
      //     to: '/inspire'
      //   }
      // ],
      title: 'پابل'
    }
  },
}
</script>
