<template>
  <v-app class="app">
    <top-bar></top-bar>
    <main class="wrapper">
<!--      <v-container>-->
        <nuxt />
<!--      </v-container>-->
    </main>
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
<style lang="scss">
.v-application {
  font-family: IranSans;
  .title {
    font-family: IranSans;
  }
}
</style>
