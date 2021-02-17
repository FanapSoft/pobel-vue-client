<template>
  <div class="row-old" id="trasactions-history">
    <div class="col-12-old">
      <h3>تاریخچه‌ی تراکنش‌ها</h3>
      <ul id="transactions-table">
        <p
          v-if="!transactions || !transactions.length"

          class="no-transaction" style="margin-bottom: 0">تراکنشی موجود نیست!</p>
        <template v-else>
          <li class="header">
            <span class="reason">مجموعه داده</span>
            <span class="description">توضیحات</span>
            <span class="credit-amount">مبلغ</span>
            <span class="time">تاریخ</span>
          </li>

          <li
            v-for="item in transactions"
            class="header">
            <span v-if="item.dataset" class="reason">{{item.dataset.name}}</span>
            <span v-else class="reason">...</span>
            <span class="description">{{ item.reasonDescription || 'توضیحات' }}</span>
            <span class="credit-amount">
                  {{ $utils.formatNumber($utils.toFixed(item.creditAmount)) }}
                </span>
            <span class="time">{{ new Date(item.creationTime).toLocaleDateString('fa-IR')}}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Transactions",
  props: {
    user: null,
    dataset: null
  },
  data(){
    return {
      transactions: null
    }
  },
  methods: {
    async getTransactions() {
      this.loadingTransactions = true;
      //TODO: We should limit this to current dataset
      let data = {
        DataSetId: (this.dataset ? this.dataset.id : null),//Added temporarily
        OwnerId: this.user.id
      }

      try {
        const transactions = await this.$apiService.get('/api/services/app/Transactions/GetAll',data);
        if (transactions.data && transactions.data.result) {
          this.transactions = transactions.data.result.items;
          this.transactions.forEach(async item => {
            this.$set(item, 'dataset', await this.fetchDataset(item.referenceDataSetId))
            //item.dataset = await this.fetchDataset(item.referenceDataSetId)
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingTransactions = false
      }
    },
    async fetchDataset(id) {
      if(!id)
        return null

      let data = {
        id: id
      }

      try {
        const ds = await this.$apiService.get('/api/services/app/Datasets/Get', data);

        if (ds.data && ds.data.result) {

          return ds.data.result
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.getTransactions();
  }
}
</script>

<style scoped>

</style>
