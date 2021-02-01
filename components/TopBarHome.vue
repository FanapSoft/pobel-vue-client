<template>
  <div>
    <navbar-type1></navbar-type1>
    <hero-home></hero-home>
  </div>
</template>

<script>
import NavbarType1 from "./navbars/NavbarType1";
import HeroHome from "./heroes/HeroHome";
export default {
  name: "TopBarHome",
  components: {HeroHome, NavbarType1}
}
</script>

<style scoped>

</style>
