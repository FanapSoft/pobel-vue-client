<template>
  <div>
    one dataset
    <navbar-type2></navbar-type2>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col cols="12"><v-card>hg</v-card></v-col>
          <v-col cols="12"><v-card>hg</v-card></v-col>
          <v-col cols="12"><v-card>hg</v-card></v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">jk</v-card>
      </v-col>
    </v-row>
    <div>
      <targets></targets>
    </div>
    <div>
      <transactions></transactions>
    </div>
    <div>
      <dataset-items></dataset-items>
    </div>
  </div>
</template>

<script>
import NavbarType2 from "../../components/navbars/NavbarType2";
import Targets from "../../components/dataset/Targets";
import Transactions from "../../components/dataset/Transactions";
import DatasetItems from "../../components/dataset/DatasetItems";
export default {
  name: "Dataset._id",
  layout: 'main',
  components: {DatasetItems, Transactions, Targets, NavbarType2}
}
</script>

<style scoped>

</style>
