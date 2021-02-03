<template>
  <v-container>
    <navbar-type2></navbar-type2>
    <v-row>
      <v-col cols="8">
        linear
      </v-col>
      <v-col cols="4">
        jkjk
      </v-col>
    </v-row>
    <v-layout>
      <v-btn>ارسال پاسخ ها</v-btn>
      <v-spacer></v-spacer>
      <v-btn>گزارش</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import NavbarType2 from "~/components/navbars/NavbarType2";

export default {
  name: "labeling_grid_id",
  layout: 'default',
  components: {NavbarType2}
}
</script>

<style scoped>

</style>
