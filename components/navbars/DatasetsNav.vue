<template>
  <div>
    <ul>
      <li>Nav type 2</li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex"

export default {
  name: "DatasetsNav",
  computed: {
    ...mapGetters({
      user: "auth/currentUser",
      isAuthenticated: "auth/isAuthenticated"
    })
  },
  mounted() {}
}
</script>

<style scoped>

</style>
