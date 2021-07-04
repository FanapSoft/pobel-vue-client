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
          :style="{'background-image': `url(${$axios.defaults.baseURL}/file/dataset/item/${item.dataSetItemId})`}"

          class="dataset-answers-history-items">
          <span class="dataset-answers-history-items-result">{{ `${(item.answer) ? '⤫' : '✓'}` }}</span>
          <span class="dataset-answers-history-items-name">{{ (item.title ? item.title.replace(/[0-9]/g, '').replace(/_/g, ' '): 'بی نام') }}</span>

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
        DataSetId: this.dataset.id,
        IncludeQuestion: true,
        UserId: this.user.id,
        skipCount: this.pagination.skip,
        Limit: this.pagination.perPage
      }

      try {
        const answers = await this.$apiService.get('/api/Answers/GetAll', data);
        if (answers.data && answers.data.result) {
          let tmp = answers.data.result.items.filter(item => {
            return !this.userAnswers.map(item => item.id).includes(item.id);
          })

          this.$set(this, 'userAnswers', [
            ...this.userAnswers,
            ...tmp
          ])

          if(!this.pagination.realCount) {
            this.pagination.realCount = answers.data.result.totalCount;
          }
          this.pagination.skip = this.userAnswers.length;
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

</style>
