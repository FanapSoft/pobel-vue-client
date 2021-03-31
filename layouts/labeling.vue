<template>
  <v-app
    class="app"
    style="background-image: linear-gradient(0deg, #ffffff 0%, #ededef 100%);">
    <main class="wrapper questions" style="align-items: center; display: flex">
      <nuxt />
    </main>
  </v-app>
</template>

<script>
import directionality from "~/mixins/directionality"

export default {
  name: "labeling",
  mixins: [directionality],
}
</script>

<style scoped>

</style>
