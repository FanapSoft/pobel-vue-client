<template>
  <v-app >
<!--    <v-app-bar
      fixed
      app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>-->
    <top-bar-home></top-bar-home>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <div>footer</div>
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
export default {
  components: {TopBarHome},
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome jkj',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      title: 'پابل'
    }
  },
  mounted() {
  }
}
</script>
