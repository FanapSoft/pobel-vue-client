<template>
  <v-card>
    <v-card-title></v-card-title>
    <v-card-text  class="justify-center align-center">
      <slot name="content"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CustomCartType1"
}
</script>

<style scoped>

</style>
