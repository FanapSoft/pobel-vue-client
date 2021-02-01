<template>
  <div>
    <h3>فعال‌ترین کاربران</h3>
    <ul>
      <li
        v-for="(item, index) in users"
        :key="index">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Users",
  data(){
    return {
      users: [
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
        {name: 'اصفی', count: 10},
      ]
    }
  },
  methods: {
    async getItems() {
      this.loading = true;
      const data = {
        DatasetId: this.datasetId,
        From: this.$store.state['scoreboard/dateFrom'],
        //DatasetItemId: this.datasetId,
        SkipCount: this.pagination.skip,
      };

      try {
        const scoreboardItems = await this.$http.get(this.$utils.addParamsToUrl(`/api/services/app/Reports/Scoreboard`, data));
        if (scoreboardItems.data && scoreboardItems.data.result) {
          this.scoreboardItems = this.scoreboardItems ? [
            ...this.scoreboardItems,
            scoreboardItems.data.result
          ] : scoreboardItems.data.result;



          this.pagination.count = this.scoreboardItems.length;
          this.pagination.realCount = this.pagination.realCount + this.pagination.count;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>

</style>
