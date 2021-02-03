<template>
  <div>
    <h3>پاسخ های شما: </h3>
    <v-card
      elevation="0"
      v-if="!datasetItems"

      class="text-center pa-4">پاسخی موجود نیست!</v-card>
    <div v-else>
      <dataset-item-type1
        :key="index"

        v-for="(item, index) in datasetItems"></dataset-item-type1>
    </div>
  </div>
</template>

<script>
import DatasetItemType1 from "./DatasetItemType1";
export default {
  name: "datasetItems",
  components: {DatasetItemType1},
  data(){
    return {
      datasetItems: null
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
