<template>
  <div>
    dashboard
    <h3>خوش امدید</h3>
    <v-row>
      <v-col cols="6">
        <custom-cart-type1 title="1222">
          <template v-slot:content>
            cvvc
          </template>
        </custom-cart-type1>
      </v-col>
      <v-col cols="6">
        <custom-cart-type1 >
          <template v-slot:content>
            1321321
          </template>
        </custom-cart-type1>
      </v-col>
      <v-col cols="6">
        <custom-cart-type1>
          <template v-slot:content>
            46
          </template>
        </custom-cart-type1>
      </v-col>
      <v-col cols="6">
        <custom-cart-type1>
          <template v-slot:content>
            789
          </template>
        </custom-cart-type1>
      </v-col>
    </v-row>
    <transactions></transactions>
  </div>
</template>

<script>
import NavbarType1 from "../components/navbars/NavbarType1";
import Transactions from "../components/dataset/Transactions";
import CustomCartType1 from "../components/general/CustomCardType1";
export default {
  components: {CustomCartType1, Transactions, NavbarType1},
  name: "conteact",
  layout: 'main',
}
</script>

<style scoped>
</style>
