<template>
  <div>
    <ul>
      <li>65</li>
      <li>4564</li>
      <li>768</li>
      <li>87</li>
      <li>87</li>
      <li>78</li>
    </ul>
    <NuxtLink v-if="!isAuthenticated" to="/auth/login">Login</NuxtLink>
    <NuxtLink v-else to="/auth/logout">logout</NuxtLink>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex"

export default {
  name: "NavbarType1",
  computed: {
    ...mapGetters({
      user: "auth/currentUser",
      isAuthenticated: "auth/isAuthenticated"
    })
  },
  mounted() {
    console.log(this.user, this.isAuthenticated);
  }
}
</script>

<style scoped>

</style>
