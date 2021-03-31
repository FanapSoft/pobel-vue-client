<template>
<!--  <div class="container-old datasets-wrapper">
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
                v-if="!walletCredit">
                0 <small>تومان</small>
              </template>
              <template
                v-else>{{ walletCredit }}<small>ریال</small>
              </template>
            </p>
&lt;!&ndash;            <button
              outlined x-small

              style="letter-spacing: 0"
              @click="requestCashout"

              id="cashout-btn"
              class="set-target-btn">انتقال به کیف پول</button>&ndash;&gt;


            <v-dialog width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined x-small

                  :loading="loadingRequestCashout"

                  v-bind="attrs"
                  v-on="on"

                  id="cashout-btn"
                  style="letter-spacing: 0;padding: 13px 10px"
                  class="set-target-btn">انتقال به کیف پول</v-btn>
              </template>

              <v-card>
                <v-card-title

                  class="headline "
                  style="font-family: 'IranSans' !important;font-size: 16px !important;">
                  درخواست انتقال به کیف پول
                </v-card-title>
                <v-card-text class="pt-6">
                  <v-form v-model="userPhoneNumberValid">
                    <v-text-field
                       filled dense rounded
                       color="#333"
                       type="number"
                       :rules="[
                         $utils.validators.iranmobile,
                         $utils.validators.betweenLength(userPhoneNumber, 3, 11)
                       ]"
                       dir="ltr"

                      label="تلفن همراه"
                      v-model="userPhoneNumber"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text

                    :disabled="!userPhoneNumberValid"
                    @click="requestCashout"

                    color="primary">
                    ثبت
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>

      <transactions :user="user"></transactions>
    </div>
  </div>-->
  <v-container class=" datasets-wrapper px-md-12 px-sm-8">

      <v-row class=" header">
        <v-col sm="12" class=" dataset-list-name">
          <h3>خوش آمدید<small>{{ user.fullName }}</small></h3>
        </v-col>
      </v-row>

      <v-row class="dataset-history">
        <v-col cols="12" sm="6">
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px"><small>نام کاربری: </small>
            <p id="stats-all">{{ user.userName }}</p>
          </v-card>
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px">
            <small>وضعیت اکانت: </small>
            <p id="stats-status">
              <template v-if="user.isActive">فعال</template>
              <template v-else>غیرفعال</template>
            </p>
          </v-card>
        </v-col>

        <v-col  cols="12" sm="6" >
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px">
            <small>تعداد پاسخ های ثبت شده: </small>
            <p id="stats-answers">{{ answersCount }}</p>
          </v-card>
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px"
            id="cash-out-wrapper">
            <small>اعتبار کیف پول: </small>
            <p id="wallet-credit">
              <template
                v-if="!walletCredit">
                0 <small>تومان</small>
              </template>
              <template
                v-else>{{ walletCredit }}<small>ریال</small>
              </template>
            </p>

            <v-dialog v-model="creditModalKey" width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined x-small

                  :loading="loadingRequestCashout"

                  v-bind="attrs"
                  v-on="on"

                  id="cashout-btn"
                  style="letter-spacing: 0;padding: 13px 10px"
                  class="set-target-btn">انتقال به کیف پول پاد</v-btn>
              </template>

              <v-card>
                <v-card-title

                  class="headline "
                  style="font-family: 'IranSans' !important;font-size: 16px !important;">
                  درخواست انتقال به کیف پول پاد
                </v-card-title>
                <v-card-text class="pt-6">
                  <v-form v-model="userPhoneNumberValid">
                    <v-text-field
                       filled dense rounded
                       color="#333"
                       type="number"
                       :rules="[
                         $utils.validators.iranmobile,
                         $utils.validators.betweenLength(userPhoneNumber, 3, 11)
                       ]"
                       dir="ltr"

                      label="تلفن همراه"
                      v-model="userPhoneNumber"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text

                    :disabled="!userPhoneNumberValid"
                    @click="requestCashout"

                    color="primary">
                    ثبت
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>

      <transactions :user="user"></transactions>

  </v-container>
</template>

<script>
import Transactions from "../components/dataset/Transactions";
import CustomCartType1 from "../components/general/CustomCardType1";

import {mapGetters} from "vuex"
import Modal from "../plugins/external/Modal";

export default {
  components: {CustomCartType1, Transactions},
  name: "dashboard",
  layout: 'main',
  middleware: "authRequired",
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
      loadingRequestCashout: false,
      userPhoneNumber: '',
      userPhoneNumberValid: true,
      creditModalKey: false
    }
  },
 /* beforeRouteEnter(to, from, next) {
    console.log("before route called");
    const previousRoute = from.path || from.fullPath
    console.log(`Previous Route ${previousRoute}`)
    next()
  },*/
  methods: {
    async getWalletBalance() {
      let data = {
        ownerId: this.user.id
      }

      try {
        const walletCredit = await this.$apiService.get('/api/services/app/Transactions/GetBalance',data);
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
        const answersCount = await this.$apiService.get('/api/services/app/Answers/GetAll', data);
        if (answersCount.data && answersCount.data.result) {
          this.answersCount = answersCount.data.result.totalCount
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingAnswers = false
      }
    },
    async requestCashout() {
      this.creditModalKey = false;
      if(!this.walletCredit) {
        let continueModal = Modal({
          title: "خطا، انتقال انتجام نشد",
          body: `چیزی برای برداشت ندارید!`,
          actions: [
            {
              title: 'بستن',
              class: ['noBorder'],
              fn: () => {
                continueModal.close();
              }
            }
          ],
          closeBtnAction: () => {
            continueModal.close();
          }
        });

        return;
      }
      this.loadingRequestCashout = true;
      let data = {
        PhoneNumber: this.userPhoneNumber
      }

      try {
        const requestCashOut = await this.$axios.post('/api/services/app/Wallet/TransferCreditToWallet', data);
        if (requestCashOut.data && requestCashOut.data.result) {
          //console.log(requestCashOut)
          let balance = this.walletCredit;
          let continueModal = Modal({
            title: "انتقال موفق",
            body: `مبلغ
              ${balance}
               ریال
               به کیف پول پاد شما منتقل شد.`,
            backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
            fullscreen: true,
            actions: [
              {
                title: 'بستن',
                class: ['noBorder'],
                fn: () => {
                  continueModal.close();
                }
              }
            ],
            closeBtnAction: () => {
              continueModal.close();
            }
          });
          await this.getWalletBalance();

         // this.answersCount = answersCount.data.result.totalCount
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingRequestCashout = false
      }
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
#cashout-btn {
  color: #000;
}
#cashout-btn:hover {
  color: #ffe58a;
}
</style>
