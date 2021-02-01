<template>
  <div>
    <navbar-type1></navbar-type1>
    <hero-small></hero-small>
  </div>
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
