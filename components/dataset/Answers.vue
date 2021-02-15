<template>
  <div class="row-old dataset-answers" v-if="userAnswers.length">
    <div class="col-12-old">
      <h3>پاسخ های شما: </h3>
      <ul class="dataset-answers-history" id="answers-wrapper">
        <li

          v-for="(item, index) of userAnswers"
          :id="`${item.id}-image`"
          :style="{'background-image': `url(${$axios.defaults.baseURL}/file/dataset/item/${item.dataSetItemId})`}"

          class="dataset-answers-history-items">
          <span class="dataset-answers-history-items-result">{{ `${(item.answer) ? '⤫' : '✓'}` }}</span>
          <span class="dataset-answers-history-items-name">{{ (item.questionObject ? JSON.parse(item.questionObject).Title.replace(/[0-9]/g, '').replace(/_/g, ' '): 'بی نام') }}</span>

        </li>
      </ul>
    </div>
  </div>
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
      }
    }
  },
  methods: {
    async getUserAnswers() {

      let data = {
        DataSetId: this.dataset.id,
        IncludeQuestion: true,
        UserId: this.user.id,
        skipCount: this.pagination.skip,
        MaxResultCount: this.pagination.perPage
      }

      try {
        const answers = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Answers/GetAll',data));
        if (answers.data && answers.data.result) {
          this.userAnswers = [
            ...this.userAnswers,
            ...answers.data.result.items
          ];

          if(!this.pagination.realCount) {
            this.pagination.realCount = answers.data.result.totalCount;
          }
          this.pagination.skip = this.userAnswers.length;
          if(this.userAnswers.length >= this.pagination.realCount) {
            this.pagination.hasMore = false;
            this.$emit("answersCount", this.pagination.realCount)
          }
        }
      } catch (error) {
        console.log(error)
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
