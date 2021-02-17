<template>
  <div class="container-old datasets-wrapper">
    <div class="row-old">
      <div class="row-old header">
        <div class="col-12-sm-old dataset-list-name">
          <h3>خوش آمدید<small>{{ user.fullName }}</small></h3>
        </div>
      </div>

      <div class="row-old dataset-history">
        <div class="col-6-sm-old">
          <div class="dataset-history-wrapper"><small>نام کاربری: </small>
            <p id="stats-all">{{ user.userName }}</p></div>
          <div class="dataset-history-wrapper">
            <small>وضعیت اکانت: </small>
            <p id="stats-status">
              <template v-if="user.isActive">فعال</template>
              <template v-else>غیرفعال</template>
            </p>
          </div>
        </div>

        <div class="col-6-sm-old">
          <div class="dataset-history-wrapper"><small>تعداد پاسخ های ثبت شده: </small>
            <p id="stats-answers">{{ answersCount }}</p></div>
          <div class="dataset-history-wrapper" id="cash-out-wrapper"><small>اعتبار کیف پول: </small>
            <p id="wallet-credit">
              <template
                v-if="walletCredit">
                0 <small>تومان</small>
              </template>
              <template
                v-else>{{ walletCredit }}<small>ریال</small>
              </template>
            </p>
            <button
              @click="requestCashout"

              id="cashout-btn"
              class="set-target-btn">انتقال به کیف پول</button>
          </div>
        </div>
      </div>

      <transactions :user="user"></transactions>
    </div>
  </div>
</template>

<script>
import Transactions from "../components/dataset/Transactions";
import CustomCartType1 from "../components/general/CustomCardType1";

import {mapGetters} from "vuex"

export default {
  components: {CustomCartType1, Transactions},
  name: "dashboard",
  layout: 'main',
  computed: {
    ...mapGetters({
      isAuthenticated: `auth/isAuthenticated`,
      user: `auth/currentUser`
    })
  },
  data() {
    return {
      walletCredit: 0,
      answersCount: 0,
      transactions: null,
      loadingAnswer: false,
      loadingTransactions: false,
    }
  },
  methods: {
    async getWalletBalance() {
      let data = {
        ownerId: this.user.id
      }

      try {
        const walletCredit = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Transactions/GetBalance',data));
        if (walletCredit.data && walletCredit.data.result) {
          this.walletCredit = this.$utils.formatNumber(this.$utils.toFixed(walletCredit.data.result.total))
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getTransactions() {
      this.loadingTransactions = true;
      let data = {
        ownerId: this.user.id
      }

      try {
        const transactions = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Transactions/GetAll',data));
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
        const ds = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Datasets/Get', data));
        console.log(ds)
        if (ds.data && ds.data.result) {

          return ds.data.result
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getAnswers() {
      this.loadingAnswers = true;
      let data = {
        UserId: this.user.id
      }

      try {
        const answersCount = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Answers/GetAll', data));
        if (answersCount.data && answersCount.data.result) {
          this.answersCount = answersCount.data.result.totalCount
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingAnswers = false
      }
    },
    requestCashout(){
      console.log('انتقال اعتبار به کیف پول پاد در حال پیاده سازی می باشد!');
    }
  },
  mounted() {
    this.getWalletBalance();
    this.getAnswers();
    this.getTransactions();
  }
}
</script>

<style scoped>
.article {
  margin-top: -64px;
}

.title {
  text-transform: capitalize;
}

.subtitle {
  opacity: 0.65;
  display: block;
  text-indent: 16px;
  font-style: italic;
  margin-top: -12px;
}

.summary {
  padding-top: 16px;
}

.content {
  position: relative;
  border-top: 2px solid var(--blue);
  padding-top: 32px;
  margin-top: 32px;
}

.back {
  top: -16px;
  display: block;
  padding: 4px 12px;
  position: absolute;
  margin-bottom: 16px;
  background: var(--blue);
  border-radius: var(--radius);
  font-family: var(--font-header);
  text-transform: uppercase;
  color: var(--offwhite);
  padding-left: 32px;
  line-height: 20px;
  font-weight: 800;
  font-size: 80%;
}

.back::after {
  content: '➤';
  position: absolute;
  transform: rotate(180deg);
  font-size: 14px;
  left: 10px;
  top: 4px;
}

</style>
