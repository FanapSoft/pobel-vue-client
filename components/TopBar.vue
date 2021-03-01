<template>
  <header
    :class="{'hero': showHero}">
    <navbar-type1></navbar-type1>
    <div
      v-if="showHero"

      class="titles">
      <h1>Pobel</h1>
      <h3>POD's Crowdsourcing Labeling Service</h3>
    </div>
  </header>
</template>

<script>
import NavbarType1 from "./navbars/NavbarType1";

export default {
  name: "TopBar",
  data () {
    return {
      showHero: true
    }
  },
  components: {NavbarType1},
  created() {
    if(this.$utils && this.$utils.routeOption(this.$route, 'hero', false)) {
      this.showHero = false;
    }
  },
  watch: {
    $route() {
      if(this.$utils && this.$utils.routeOption(this.$route, 'hero', false)) {
        this.showHero = false;
      } else {
        this.showHero = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
