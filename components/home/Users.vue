<template>
  <div class="col-12-old" v-if="scoreboardItems">
    <h3>{{$t('TEXTS.INDEXTOPACTIVEUSERS')}}</h3>
    <ol

      id="pobel-scoreboard">
      <li v-for="user in scoreboardItems">
        <span class="scoreboard-name">{{ `${(user.Name ? user.Name : 'بی نام')} ${(user.Surname? user.Surname : '')}` }}</span>
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
        Limit: 10,
      };

      try {
        const scoreboardItems = await this.$apiService.get(`/api/Reports/Scoreboard`, data);
        if (scoreboardItems.data) {
          this.scoreboardItems = this.scoreboardItems ? [
            ...this.scoreboardItems,
            scoreboardItems.data
          ] : scoreboardItems.data;
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
