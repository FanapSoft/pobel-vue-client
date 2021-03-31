<template>
  <v-row id="trasactions-history">
    <v-col cols="12">
      <h3>{{$t('TRANSACTIONS.TRANSACTIONSHISTORY')}}</h3>
      <v-card elevation="0" class="pa-4 my-8">
        <v-data-table
          v-if="transactions && transactions.length"

          disable-sort
          hide-default-footer
          disable-filtering
          disable-pagination
          elevation="0"

          :headers="[
          {
            text: $t('DATASET.DATASETPER'),
            align: 'start',
            sortable: false,
            value: 'dataset',
          },
          { text: $t('GENERAL.DESCRIPTION'), value: 'description' },
          { text: $t('GENERAL.AMOUNT'), value: 'amount'},
          { text: $t('GENERAL.DATE'), value: 'date' },
        ]"
          :items="transactions"
          :items-per-page="5"
          id="transactions-table"
          class="transactions-list elevation-0  pa-0 mt-0">
          <template v-slot:header.dataset="{ header }">
            <span class="reason">{{ header.text }}</span>
          </template>
          <template v-slot:header.amount="{ header }">
            <span class="credit-amount">
                    {{ header.text }}
            </span>
          </template>
          <template v-slot:item.dataset="{ item }">
            <span
              v-if="item.dataset" class="reason">{{item.dataset.name}}</span>
              <span
                v-else class="reason">...</span>
          </template>
          <template v-slot:item.description="{ item }">
            <span class="description">{{ item.reasonDescription || $t('GENERAL.DESCRIPTION') }}</span>
          </template>
          <template v-slot:item.amount="{ item }">
            <span class="credit-amount">
                    {{ $utils.formatNumber($utils.toFixed(item.creditAmount)) }}
            </span>
          </template>
          <template v-slot:item.date="{ item }">
            <span class="time">{{ new Date(item.creationTime).toLocaleDateString('fa-IR')}}</span>
          </template>
        </v-data-table>
        <p
          v-else

          class="no-transaction" style="margin-bottom: 0">تراکنشی موجود نیست!</p>
      </v-card>

<!--      <ul id="transactions-table">

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
      </ul>-->
    </v-col>
  </v-row>
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

<style lang="scss" >
.transactions-list .v-data-table__wrapper > table > tbody > tr {

   td,  th {
    text-align: center !important;
  }
}

[dir="rtl"] .v-application .transactions-list .v-data-table__wrapper > table > tbody > tr,
[dir="ltr"] .v-application .transactions-list .v-data-table__wrapper > table > tbody > tr,
[dir="ltr"] .v-application .transactions-list .v-data-table__wrapper > table > thead > tr {

  td.text-start, th.text-start {
    text-align: center !important;
  }
}

.v-application--is-rtl .v-data-table > .v-data-table__wrapper > table > tbody > tr ,
.v-application--is-rtl .v-data-table > .v-data-table__wrapper > table > thead > tr ,
.v-application--is-rtl .v-data-table > .v-data-table__wrapper > table > tfoot > tr {
  > th {
    text-align: center !important;
    font-size: 14px !important;
    font-weight: bold !important;
    color: #000000 !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.04) !important;
  }
}
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
  border-bottom: thin solid rgba(0, 0, 0, 0.04) !important;
}

#transactions-table thead span.description {
  width: 45%;
  font-size: 14px;
  text-align: center;
  color: #212121;
}

#transactions-table tbody span.description {
  color: #888;
  font-weight: bold;
  font-size: 12px;
}

#transactions-table tbody  {
  span.reason, span.time{
    color: #000;
    font-weight: bold;
    font-size: 14px;
  }
}
</style>
