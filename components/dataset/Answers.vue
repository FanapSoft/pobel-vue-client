<template>
  <div>
    <h3>پاسخ های شما: </h3>
    <v-card
      elevation="0"
      v-if="!answers"

      class="text-center pa-4">پاسخی موجود نیست!</v-card>
    <div v-else>
      <answer-item
        :key="index"

        v-for="(item, index) in answers"></answer-item>
    </div>
  </div>
</template>

<script>
import AnswerItem from "./AnswerItem";
export default {
  name: "answers",
  components: {AnswerItem},
  data(){
    return {
      answers: null
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
