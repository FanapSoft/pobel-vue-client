<template>
  <header class="hero">
    <navbar-type1></navbar-type1>
    <div class="titles">
      <h1>Pobel</h1>
      <h3>POD's Crowdsourcing Labeling Service</h3>
    </div>
  </header>
</template>

<script>
import NavbarType1 from "./navbars/NavbarType1";
import HeroSmall from "./heroes/HeroSmall";

export default {
  name: "TopBar",
  components: {HeroSmall, NavbarType1}
}
</script>

<style scoped>

</style>
