<template>
  <v-row class="dataset-answers" v-if="userAnswers.length">
    <v-col cols="12" class="">
      <h3>{{ $t('GENERAL.YOURANSWERS') }}: </h3>
      <ul
        class="dataset-answers-history"
        style="padding-left: 0"
        id="answers-wrapper">
        <li

          v-for="(item, index) of userAnswers"
          :id="`${item.id}-image`"

          class="dataset-answers-history-items">
          <span>{{ item.DatasetItem.Content.replaceAll('_x000D_', ' ').substr(0, 30) + '..' }}</span>
          <span class="dataset-answers-history-items-result">
<!--            {{ `${(item.Answer === 0) ? '⤫' : '✓'}` }}-->
            <template v-if="item.Answer === -1">😡</template>
            <template v-if="item.Answer === 0">🙄</template>
            <template v-if="item.Answer === 1">😄</template>
          </span>
        </li>
      </ul>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Answers",
  props: {
    user: null,
    dataset: null
  },
  data() {
    return {
      userAnswers: [],
      pagination: {
        skip: 0,
        perPage: 15,
        realCount: 0,
        hasMore: true
      },
      loadingAnswers: false
    }
  },
  methods: {
    async getUserAnswers() {
      //this.loadingAnswers = true;
      this.$nuxt.$loading.start()

      let data = {
        DatasetId: this.dataset.Id,
        IncludeDatasetItem: true,
        UserId: this.user.Id,
        Skip: this.pagination.skip,
        Limit: this.pagination.perPage
      }

      try {
        const answers = await this.$apiService.get('/api/Answers/GetAll', data);
        if (answers.status < 400) {
          let tmp = answers.data.items.filter(item => {
            return !this.userAnswers.map(item => item.Id).includes(item.Id);
          })

          this.$set(this, 'userAnswers', [
            ...this.userAnswers,
            ...tmp
          ]);

          if(!this.pagination.realCount) {
            this.pagination.realCount = answers.data.totalCount;
          }
          this.pagination.skip += this.userAnswers.length;

          if(this.userAnswers.length >= this.pagination.realCount || this.userAnswers.length >= 250) {
            this.pagination.hasMore = false;
            this.$emit("answersCount", this.pagination.realCount)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        //this.loadingAnswers = false;
        this.$nuxt.$loading.finish()
      }
    },
    loadMore(){
      if(this.pagination.hasMore) {
        this.getUserAnswers();
      }
    },
    scrollListener(ev) {
      if (document.getElementById('answers-wrapper')) {
        if ((window.innerHeight + window.scrollY + 1) >= document.body.offsetHeight) {
          this.loadMore()
        }
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollListener);
  },
  async mounted() {
    await this.getUserAnswers();
    window.addEventListener("scroll", this.scrollListener)
  }
}
</script>

<style scoped>
.dataset-answers-history .dataset-answers-history-items{
  width: 250px;
  height: auto;
  padding: 5px;
  margin-bottom: 15px;
  font-size: 10px;
}
.dataset-answers-history .dataset-answers-history-items > span.dataset-answers-history-items-result{
  top: -10px;
  font-size: 16px;
}
</style>
