<template>
  <v-container class=" datasets-wrapper px-md-12 px-sm-8">

      <v-row class=" header">
        <v-col sm="12" class=" dataset-list-name">
          <h3>{{ $t('USER.WELCOME')}}<small>{{ user.Name + ' ' + user.Surname }}</small></h3>
        </v-col>
      </v-row>

      <v-row class="dataset-history">
        <v-col cols="12" sm="6">
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px"><small>{{$t('USER.USERNAME')}}: </small>
            <p id="stats-all">{{ user.UserName }}</p>
          </v-card>
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px">
            <small>{{$t("USER.ACCOUNTSTATUS")}}: </small>
            <p id="stats-status">
              <template v-if="user.IsActive">{{$t('GENERAL.ACTIVE')}}</template>
              <template v-else>{{$t('GENERAL.INACTIVE')}}</template>
            </p>
          </v-card>
        </v-col>

        <v-col  cols="12" sm="6" >
          <v-card
            elevation="0"
            class="dataset-history-wrapper "
            style="border-radius: 10px">
            <small>{{ $t('TEXTS.SINGLEDATASETYOURANSWERSCOUNT') }}: </small>
            <p id="stats-answers">{{ answersCount.toLocaleString() }}</p>
          </v-card>
          <v-card
            elevation="0"
            class="dataset-history-wrapper"
            style="border-radius: 10px"
            id="cash-out-wrapper">
            <small class="pl-1">{{$t('USER.WALLETCREDIT')}}: </small>
            <p id="wallet-credit">
              <template
                v-if="!walletCredit">
                0 <small>{{ $t('GENERAL.IRT') }}</small>
              </template>
              <template
                v-else>{{ walletCredit }}<small>{{$t('GENERAL.IRT')}}</small>
              </template>
            </p>

            <v-btn
              outlined x-small
              :loading="loadingRequestCashout"
              @click="transferToPodWallet"

              id="cashout-btn"
              style="letter-spacing: 0;padding: 13px 10px"
              class="set-target-btn">{{$t('USER.TRANSFERTOPODWALLET')}}</v-btn>

            <v-dialog v-model="creditModalKey" width="400">
              <v-card>
                <v-card-title

                  class="headline "
                  style="font-family: 'IranSans' !important;font-size: 16px !important;">
                  {{$t('TEXTS.DASHBOARDTRANSFERTOPODWALLETREQUEST')}}
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

                      :label="$t('GENERAL.MOBILE')"
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
                    {{ $t('GENERAL.SUBMIT') }}
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
        const walletCredit = await this.$apiService.get('/api/Transactions/GetBalance',data);
        if (walletCredit.data) {
          this.walletCredit = this.$utils.formatNumber(this.$utils.toFixed(walletCredit.data.creditAmount))
        }
      } catch (error) {
        console.log(error)
      }
    },
    async fetchDataset(id) {
      if(!id)
        return null

      try {
        const ds = await this.$apiService.get('/api/Datasets/Get/' + id);
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
        const answersCount = await this.$apiService.get('/api/Answers/GetAll', data);
        if (answersCount.data && answersCount.data) {
          this.answersCount = answersCount.data.totalCount
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
          title: this.$t('TEXTS.DASHBOARDMODALTRANSFERFAILEDTITLE'),
          body: this.$t('TEXTS.DASHBOARDMODALTRANSFERFAILEDCONTENT'),
          actions: [
            {
              title: this.$t('GENERAL.CLOSE'),
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
        const requestCashOut = await this.$axios.post('/api/Wallet/TransferCreditToPodWallet', data);
        if (requestCashOut.status < 400) {
          //console.log(requestCashOut)
          let balance = this.walletCredit;
          let continueModal = Modal({
            title: this.$t('TEXTS.DASHBOARDMODALTRANSFERSUCCEEDTITLE'),
            body: `
              ${balance}
               ${this.$t('TEXTS.DASHBOARDMODALTRANSFERSUCCEEDCONTENT')}`,
            backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
            fullscreen: true,
            actions: [
              {
                title: this.$t('GENERAL.CLOSE'),
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
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingRequestCashout = false
      }
    },
    transferToPodWallet() {
      if(!this.user.PhoneNumber)
        this.creditModalKey = true;
      else {
        this.requestCashout();
      }
    }
  },
  mounted() {
    this.getWalletBalance();
    this.getAnswers();
    //this.getTransactions();
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
  display: flex;
}
#cashout-btn:hover {
  color: #ffe58a;
}

</style>
