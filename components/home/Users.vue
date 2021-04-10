<template>
  <div class="col-12-old">
    <h3>{{$t('TEXTS.INDEXTOPACTIVEUSERS')}}</h3>
    <ol
      v-if="scoreboardItems"

      id="pobel-scoreboard">
      <li v-for="user in scoreboardItems">
        <span class="scoreboard-name">{{ `${user.name} ${user.surname}` }}</span>
        <span class="scoreboard-score">{{ user.count.toLocaleString() }}</span>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: "Users",
  data(){
    return {
      scoreboardItems: null
    }
  },
  methods: {
    async getItems() {
      this.loading = true;
      const data = {
        DatasetId: this.datasetId,
        From: this.$store.state['scoreboard/dateFrom'],
        //DatasetItemId: this.datasetId,
        MaxResultCount: 10,
      };

      try {
        const scoreboardItems = await this.$apiService.get(`/api/services/app/Reports/Scoreboard`, data);
        if (scoreboardItems.data && scoreboardItems.data.result) {
          this.scoreboardItems = this.scoreboardItems ? [
            ...this.scoreboardItems,
            scoreboardItems.data.result
          ] : scoreboardItems.data.result;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    }
  },
  mounted() {
    this.getItems();
  }
}
</script>

<style scoped>

</style>
