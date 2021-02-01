<template>
  <div>
    <h3>تاریخچه‌ی تراکنش‌ها</h3>
    <v-card
      elevation="0"
      v-if="!transactions"

      class="text-center pa-4">تراکنشی موجود نیست!</v-card>
    <ul v-else>
      <li
        :key="index"
        v-for="(item, index) in transactions">targe 1</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "transactions",
  data(){
    return {
      transactions: null
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
