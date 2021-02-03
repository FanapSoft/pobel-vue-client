<template>
  <v-app>
    <top-bar></top-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavbarType1 from "../components/navbars/NavbarType1";
import TopBar from "../components/TopBar";

export default {
  components: {TopBar, NavbarType1},
  data () {
    return {
      title: 'پابل'
    }
  },
  mounted() {
  }
}
</script>
