<template>
  <div class="container-old datasets-wrapper">
    <div
      style="display: flex; align-items: center; justify-content: center;"
      v-if="!dataset" >
      <v-progress-circular
        indeterminate

        size="50"
        color="#ff257c"></v-progress-circular>
    </div>
    <div v-else>
      <v-row class="header">
        <v-col cols="6" sm="6" class=" dataset-list-name">
          <h3>{{ dataset.name }} <small>{{ dataset.description }}</small></h3>
        </v-col>

        <v-col cols="6" sm="6" class=" back-btn-wrapper">
          <div
            v-if="dataset.labelingStatus"

            id="dataset-action-wrapper">
<!-- && !currentTargetReached-->

            <template v-if="userTargetDefinition && userTargetDefinition.answerCount > userAnswersCount">
              <v-btn
                v-if="$vuetify.breakpoint.xs"

                text  outlined

                :to="`/labeling/grid/${dataset.id}`"

                class="start-btn">
                <v-icon>mdi-movie-open-play</v-icon>
              </v-btn>
              <NuxtLink
                v-else

                :to="`/labeling/grid/${dataset.id}`"

                class="start-btn">شروع برچسب زنی</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink

                to="#set-target"

                class="start-btn">انتخاب تارگت</NuxtLink>
            </template>
          </div>
          &nbsp;
          <button class="back-btn" onclick="window.location.href='/datasets'">🡠</button>
        </v-col>
      </v-row>
      <v-row class=" dataset-history">
        <v-col
          cols="12" sm="6"
          :class="{ 'pb-0': $vuetify.breakpoint.xs }">
          <div class="dataset-history-wrapper" id="set-show-target">
            <small>هدف شما</small>
            <p id="weekly-target">
              <small id="weekly-target-count" data-title="هدف شما">{{ userTargetDefinition ? $utils.formatNumber(userTargetDefinition.answerCount) : '0' }}</small>/<span id="dashboard-all-answers" data-title="پاسخ‌های شما">{{ $utils.formatNumber(userAnswersCount) }}</span>
            </p>
          </div>
          <div class="dataset-history-wrapper"><small>وضعیت تگ زنی</small>
            <p id="stats-status">
              <template v-if="dataset.labelingStatus">
                فعال
              </template>
              <template v-else>
                غیرفعال
              </template>
            </p>
          </div>
          <div class="dataset-history-wrapper " style="margin-bottom: 0" id="collect-credit"><small>امتیاز شما</small>
            <p id="stats-credit">
              {{ userCredit ? $utils.formatNumber($utils.toFixed(userCredit)) : '0.00'}}
            </p>
<!--            <button
              @click="convertScoreToMoney"
              id="collectCreditFromDataset"
              class="set-target-btn">دریافت مبلغ اعتبار</button>-->

            <v-btn
              outlined x-small

              :loading="loadingRequestCashout"


              @click="convertScoreToMoney"
              id="cashout-btn"
              style="letter-spacing: 0;padding: 13px 10px"
              class="set-target-btn">انتقال به کیف پول</v-btn>

          </div>
        </v-col>

        <v-col
          cols="12" sm="6"
          :class="{ 'pt-0': $vuetify.breakpoint.xs }">
          <div
            class="dataset-history-wrapper wobbling"
            style="height: 480px; width: 100%"
            ref="wobblingBg"
            id="wobbling-bg">
            <small>تعداد پاسخ‌های ثبت شده شما</small>
            <p id="stats-answers">{{ userAnswersCount }}</p>

            <div class="" id="dataset-history-answers-chart">
              <h2
                v-if="!userHasChart"><img src="~assets/images/nochart.svg" alt=""><br>نمودار موجود نیست!</h2>
              <canvas
                v-else

                id="myChart"></canvas>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row
        v-if="dataset.isActive"

        class=" user-targets-wrapper"
        id="set-target">
        <v-col class="">
          <h3>هدف گذاری</h3>
          <small>هدف خود برای برچسب زنی بر روی این مجموعه ی داده را مشخص کنید. توجه داشته باشید چنانچه هدف تعیین نشده باشد
            برچسب زنی ممکن نمی باشد و اعتبار فرآیند برچسب زنی نیز بدرستی محاسبه نمی گردد.</small>
          <br>
          <small>با تعیین هدف توسط فرم زیر مشخص کنید در نظر دارید چه تعداد پاسخ در این مجموعه‌ی داده ثبت کنید.</small>
          <v-row id="define-target" >
            <v-col
              v-for="(item, index) of datasetTargets"

              :key="index"

              cols="12" sm="6" class="px-1 py-0">
              <v-card
                :class="{'active': (userTargetDefinition && userTargetDefinition.id === item.id)}"
                @click="changeUserTargetTo(item)"

                elevation="0"
                class="mb-2 target-list-item">
                <v-row class="ma-0">
                  <v-col cols="9" >
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0">
                        {{ `هدف شماره ${index + 1}` }}
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <small style="font-size: 12px">
                          حداکثر درآمد:
                          {{ $utils.formatNumber(item.uMax) }}
                          ریال
                        </small>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="3" class="text-center d-flex align-center justify-center" >
                    <h3>{{ item.answerCount }}</h3>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <transactions :dataset="dataset" :user="user"></transactions>

      <answers
        v-if="dataset"

        :dataset="dataset"
        :user="user"></answers>
    </div>
  </div>
</template>

<script>
import DatasetsNav from "../../components/navbars/DatasetsNav";
import Targets from "../../components/dataset/Targets";
import Transactions from "../../components/dataset/Transactions";
import DatasetItems from "../../components/dataset/DatasetItems";

import Wobble from "../../plugins/wobble"
import {mapGetters} from "vuex";

import Chart from "chart.js"
import Answers from "../../components/dataset/Answers";
import Modal from "~/plugins/external/Modal";

export default {
  name: "Dataset._id",
  layout: 'main',
  middleware: "authRequired",
  components: {Answers, DatasetItems, Transactions, Targets, DatasetsNav},
  data() {
    return {
      dataset: null,
      userHasChart: false,
      userCredit: 0,
      userAnswersCount: 0,

      datasetTargets: null,
      userTargetDefinition: null,
      loadingRequestCashout: false,
      //currentTargetReached: false
    }
  },
  computed: {
    ...mapGetters({
      user: "auth/currentUser"
    })
  },
  methods: {
    async getItem() {
      this.loading = true;
      const data = {
        id: this.$route.params.id
      }
      try {
        const dataset = await this.$apiService.get('/api/services/app/Datasets/Get', data);
        if(dataset.data && dataset.data.result) {
          this.dataset = dataset.data.result;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async getChartData() {
      this.loading = true;
      const data = {
        UserId: this.user.id,
        DataSetId: this.$route.params.id,
      }
      try {
        const datasets = await this.$apiService.get('/api/services/app/Reports/AnswersCountsTrend', data);
        if(datasets.data && datasets.data.result && datasets.data.result.length) {
          this.userHasChart = true;
          //this.dataset = dataset.data.result;

          let finalDataDates = [];
          let finalDataCounts = [];

          datasets.data.result.forEach(v => {
            finalDataDates.push(this.$moment(v.date).locale('fa').format('DD MMMM YY'));
            finalDataCounts.push(v.count);
          });

          let fillUpDates = [];

          if (finalDataDates.length >= 1) {
            let currDate = this.$moment(new Date(datasets.data.result[0]['date'])).startOf("day");
            let lastDate = this.$moment(new Date(datasets.data.result[datasets.data.result.length - 1]['date'])).startOf("day");

            do {
              fillUpDates.push(this.$moment(currDate.clone().toDate()).locale('fa').format('DD MMMM YY'));
            } while (currDate.add(1, "days").diff(lastDate) < 0);

            if(finalDataDates.length > 1) {
              fillUpDates.push(this.$moment(currDate.clone().toDate()).locale('fa').format('DD MMMM YY'));
            }
          } else {
            fillUpDates.push(this.$moment(new Date(datasets.data.result[0]['date'])).locale('fa').format('DD MMMM YY'));
          }
          let chartDates = [],
            chartCount = [];

          fillUpDates.forEach(date => {
            chartDates.push(date);
            if (finalDataDates.indexOf(date) > -1) {
              chartCount.push(finalDataCounts[finalDataDates.indexOf(date)]);
            } else {
              chartCount.push(0);
            }
          });

          this.$nextTick(() => {
            setTimeout(() => {
              let ctx = document.getElementById('myChart');//.getContext('2d');

              let myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: chartDates,
                datasets: [{
                  label: 'تعداد برچسب‌ها',
                  data: chartCount,
                  backgroundColor: 'transparent',
                  borderColor: '#a02344',
                  pointBackgroundColor: 'white',
                  borderWidth: 1,
                  tension: 0.4,
                }]
              },
              options: {
                tooltips: {
                  backgroundColor: 'rgba(150, 20, 53, .8)',
                  titleFontFamily: '"IranSans", "Segoe UI", "Ubuntu"',
                  bodyFontFamily: '"IranSans", "Segoe UI", "Ubuntu"',
                },
                elements: {
                  point: {
                    // radius: 0
                  }
                },
                legend: {
                  display: false
                },
                layout: {
                  padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                  }
                },
                scales: {
                  xAxes: [{
                    gridLines: {
                      display: false
                    },
                    ticks: {
                      // maxTicksLimit: 7,
                      display: false,
                    }
                  }],
                  yAxes: [{
                    gridLines: {
                      display: false
                    },
                    ticks: {
                      beginAtZero: true,
                      display: false
                    }
                  }]
                }
              }
            });
            }, 200);
          })
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async getUserCredit(ds) {
      let data = {
        userId: this.user.id,
        dataSetId: ds
      }

      try {
        const credit = await this.$apiService.get('/api/services/app/Credit/GetCredit', data);
        if(credit.data && credit.data.result && credit.data.result.credit) {
          this.userCredit = credit.data.result.credit;//this.$utils.formatNumber(this.$utils.toFixed(credit.data.result.credit));

          /*if (credit.data.result.credit > 0) {
            let collectCredit = document.createElement('button');
            collectCredit.classList.add('set-target-btn');
            collectCredit.setAttribute('id', 'collectCreditFromDataset');
            collectCredit.innerText = 'دریافت مبلغ اعتبار';

            collectCredit.onclick = () => {
              this.$axios.post('/api/services/app/Credit/CollectCredit', {
                userId: this.user.id,
                dataSetId: this.$route.params.id
              }).then(cre => {
                if(!cre.error && cre.data.result.creditAmount > 0) {
                  // Toastify({
                  //   text: `امتیاز ${cre.data.result.creditAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")} به حساب پابل شما منتقل گردید.<br>برای مشاهده به <a href="/dashboard">پروفایل</a> خود مراجعه نمائید.`,
                  //   duration: 5000,
                  //   gravity: 'top',
                  //   position: 'left',
                  //   backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
                  //   onClick: () => {
                  //   }
                  // }).showToast();

                  //document.getElementById('stats-credit').innerHTML = '0.00';
                }
              }).catch(error => {
                if(error.data.error) {
                  // Toastify({
                  //   text: error.data.error.message,
                  //   duration: 5000,
                  //   gravity: 'top',
                  //   position: 'left',
                  //   backgroundColor: 'linear-gradient(to right, #EB3349 0%, #F45C43  100%)',
                  //   onClick: () => {
                  //   }
                  // }).showToast();
                }
              })
            };

            // TODO: hide transactions Button
            // document.getElementById('collect-credit').appendChild(collectCredit);
          }*/
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async convertScoreToMoney() {
      if(!this.userCredit) {
        let continueModal = Modal({
          title: "خطا",
          body: `هنوز امتیازی کسب نکرده اید`,
          backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',

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
      this.loadingRequestCashout = true
      const data = {
        userId: this.user.id,
        dataSetId: this.$route.params.id
      }
      try {
        const credit = await this.$apiService.post('/api/services/app/Credit/CollectCredit', data);
        if(credit.data && credit.data.result) {
          if(credit.data.result.creditAmount > 0) {
            let continueModal = Modal({
              title: "انتقال موفق",
              body: `امتیاز
              ${credit.data.result.creditAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}
               به حساب پابل شما منتقل گردید.
               <br>
               برای مشاهده به
               <nuxt-link to="/dashboard">پروفایل</nuxt-link>
                خود مراجعه نمائید.`,
              backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
              fullscreen: true,
              actions: [
                {
                  title: 'داشبورد',
                  class: ['active'],
                  fn: async () => {
                    continueModal.close()
                    await this.$router.push("/dashboard")
                  },
                },
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

            document.getElementById('stats-credit').innerHTML = '0.00';
          }
        } else {
          if(credit.data && credit.data.error && credit.data.error.message ) {
            if(credit.data.error.message.indexOf("You haven't reached the target yet.") !== -1) {
              let alertModal = Modal({
                title: "خطا در انتقال",
                body: `پیش از اتمام هدف فعلی نمی توانید امتیازتان در دیتاست فعلی را به پول تبدیل نمایید.`,
                backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
                actions: [
                  {
                    title: 'بستن',
                    class: ['noBorder'],
                    fn: () => {
                      alertModal.close();
                    }
                  }
                ],
                closeBtnAction: () => {
                  alertModal.close();
                }
              });
            }
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingRequestCashout = false;
      }
    },
    async getUserAnswersCount(ds) {
      let data = {
        datasetId: ds,
        userId: this.user.id,
      }

      try {
        const answers = await this.$apiService.post('/api/services/app/Answers/Stats', data);
        if(answers.data && answers.data.result) {
          this.userAnswersCount = answers.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getDatasetTargets(datasetId) {
      let data = {
        datasetId: datasetId
      }

      try {
        const targets = await this.$apiService.get('/api/services/app/TargetDefinitions/GetAll', data);
        if(targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
          this.datasetTargets = targets.data.result.items;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getUserTarget(datasetId) {
      let data = {
        datasetId: datasetId,
        ownerId: this.user.id,
        order: 'DESC',
        maxResultCount: 1
      }

      try {
        const targets = await this.$apiService.get('/api/services/app/Targets/GetAll', data);
        if(targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
          data = {
            id: targets.data.result.items[0].targetDefinitionId
          };
          let targetDefinition = await this.$apiService.get('/api/services/app/TargetDefinitions/Get', data);
          //if(targetDefinition.data && targetDefinition.data.result) {
          this.userTargetDefinition = targetDefinition.data.result
          //this.targetAnswersCount = (targetDefinition.data.result ? targetDefinition.data.result.answerCount : '0');
          //}
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async changeUserTargetTo(target) {
      let data = {
        targetDefinitionId: target.id
      }

      //TODO: create new target ?
      try {
        const result = await this.$apiService.post('/api/services/app/Targets/Create', data);
        if (result.data && result.data.result) {
          //this.userTargetDefinition = result.data.result;
          this.getUserTarget(this.$route.params.id)
        }
      } catch (error) {
        console.log(error)
      }
    },
    /*async checkIsTargetReached() {
      let data = {
        DataSetId: this.$route.params.id
      }

      try {
        const result = await this.$apiService.get('/api/services/app/Targets/GetCurrentTargetStatus', data);
        if (result.data && result.data.result ) {
          if(result.data.result.targetEnded) {
            this.currentTargetReached = true;
          }
        }
      } catch (error) {
        console.log(error)
      }
    }*/
  },
  async mounted() {
    this.getItem();
    this.getChartData();
    this.getUserCredit(this.$route.params.id);
    this.getUserAnswersCount(this.$route.params.id);
    await this.getUserTarget(this.$route.params.id);
    //this.checkIsTargetReached();
    this.getDatasetTargets(this.$route.params.id);
  },
  watch: {
    dataset() {
      this.$nextTick(() => {
        const wobble = new Wobble(document.getElementById('wobbling-bg'), `white`);

        function loop() {
          wobble.c.clearRect(0, 0, wobble.canvas.width, wobble.canvas.height);
          wobble.update();
          window.requestAnimationFrame(loop);
        }

        loop();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.target-list-item {
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.target-list-item:hover {
  background-color: #333447;
  border-color: #333447;
  color: #ffe58a;
}

.target-list-item.active {
  background-color: #ffe58a;
  border-color: #ffe58a;
  color: #333447;
}

.target-list-item p {
  font-size: 12px !important;
  text-align: center;
}

.target-list-item p small {
  vertical-align: text-top;
}


@media #{map-get($display-breakpoints, 'xs-only')} {
  .dataset-list-name {
    h3 {
      font-size: 12px;
      small {
        font-size: 10px;
      }
    }
  }

  .back-btn {
    font-size: 18px;
    min-width: 40px;
    height: 40px;
    line-height: 42px;
  }
}
</style>
