<template>
  <div class="container-old datasets-wrapper">
    <div
      v-if="!dataset"

      style="display: flex; align-items: center; justify-content: center;" >
      <loader />
    </div>
    <div v-else>
      <v-row class="header">
        <v-col cols="6" sm="6" class=" dataset-list-name">
          <h3>{{ dataset.Name }} <small>{{ dataset.Description }}</small></h3>
        </v-col>

        <v-col cols="6" sm="6" class=" back-btn-wrapper">
          <div
            v-if="dataset.LabelingStatus"

            id="dataset-action-wrapper">
<!-- && !currentTargetReached-->

            <template v-if="userTargetDefinition && userTargetDefinition.AnswerCount > userAnswersCount">
              <v-btn
                v-if="$vuetify.breakpoint.xs"

                text  outlined

                :to="generateLabelingTemplateLink(dataset)"

                class="start-btn">
                <v-icon>mdi-movie-open-play</v-icon>
              </v-btn>
              <NuxtLink
                v-else

                :to="generateLabelingTemplateLink(dataset)"

                class="start-btn">{{$t('GENERAL.STARTLABELING')}}</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink

                to="#set-target"

                class="start-btn">{{ $t('GENERAL.CHOOSEATARGET') }}</NuxtLink>
            </template>
          </div>
          &nbsp;
          <nuxt-link class="back-btn" to="/datasets">{{ $isRTL ? '🡠' : '🡢'}}</nuxt-link>
        </v-col>
      </v-row>
      <v-row class=" dataset-history">
        <v-col
          cols="12" sm="6"
          :class="{ 'pb-0': $vuetify.breakpoint.xs }">
          <div class="dataset-history-wrapper" id="set-show-target">
            <small>{{ $t('GENERAL.YOURTARGET') }}</small>
            <p id="weekly-target">
              <small id="weekly-target-count" :data-title=" $t('GENERAL.YOURTARGET') ">{{ userTargetDefinition ? $utils.formatNumber(userTargetDefinition.AnswerCount) : '0' }}</small>/<span id="dashboard-all-answers" :data-title="$t('GENERAL.YOURANSWERS')">{{ $utils.formatNumber(userAnswersCount) }}</span>
            </p>
          </div>
          <div class="dataset-history-wrapper"><small>{{ $t('GENERAL.LABELINGSTATUS')}}</small>
            <p id="stats-status">
              <template v-if="dataset.LabelingStatus <= 1">
                {{ $t('GENERAL.ACTIVE') }}
              </template>
              <template v-else>
                {{ $t('GENERAL.INACTIVE') }}
              </template>
            </p>
          </div>
          <div class="dataset-history-wrapper " style="margin-bottom: 0" id="collect-credit"><small>{{ $t('GENERAL.YOURSCORE') }}</small>
            <p id="stats-credit">
              {{ userCredit ? $utils.formatNumber($utils.toFixed(userCredit)) : '0.00'}}
            </p>
            <v-btn
              outlined x-small

              :loading="loadingRequestCashout"


              @click="convertScoreToMoney"
              id="cashout-btn"
              style="letter-spacing: 0;padding: 13px 10px"
              class="set-target-btn">{{$t('GENERAL.SENDTOWALLET')}}</v-btn>

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
            <small>{{$t('TEXTS.SINGLEDATASETYOURANSWERSCOUNT')}}</small>
            <p id="stats-answers">{{ $utils.formatNumber(userTotalAnswersCount) }}</p>

            <div class="" id="dataset-history-answers-chart">
              <h2
                v-if="!userHasChart"><img src="~assets/images/nochart.svg" alt=""><br>{{$t('GENERAL.CHARTNOTAVAILABLE')}}!</h2>
              <canvas
                v-else

                id="myChart"></canvas>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row
        v-if="dataset.IsActive && dataset.LabelingStatus <= 1"

        class=" user-targets-wrapper"
        id="set-target">
        <v-col class="">
          <h3>{{$t('GENERAL.TARGETING')}}</h3>
          <small>
            {{$t('TEXTS.SINGLEDATASETCHOOSETARGET')}}
          </small>
          <br>
          <small>{{$t('TEXTS.SINGLEDATASETCHOOSETARGET2')}}</small>
          <v-row id="define-target"  >
            <v-col
              v-for="(item, index) of datasetTargets"

              :key="index"

              cols="12" sm="6" class="px-1 py-0">
              <v-card
                :class="{'active': (userTargetDefinition && userTargetDefinition.Id === item.Id)}"
                @click="changeUserTargetTo(item)"

                elevation="0"
                class="mb-2 target-list-item ">
                <div class="fire">

                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                </div>
                <v-row class="ma-0">
                  <v-col cols="9" >
                    <v-row class="ma-0">
                      <v-col cols="12" class="pa-0">
                        {{ `${$t('GENERAL.TARGETNUMBER')}${index + 1}` }}
                      </v-col>
                      <v-col cols="12" class="pa-0">
                        <small style="font-size: 12px">
                          {{ $t('GENERAL.MAXIMUMREVENUE') }}:
                          {{ $utils.formatNumber(item.UMax) }}
                          {{ $t('GENERAL.IRT') }}
                        </small>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="3" class="text-center d-flex align-center justify-center" >
                    <h3>{{ $utils.formatNumber(item.AnswerCount) }}</h3>
                  </v-col>
                </v-row>
              </v-card>

            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <transactions :dataset="dataset" :user="user"></transactions>

      <answers
        v-if="dataset && dataset.Type == 1"

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
import labelingTemplate from "@/mixins/labelingTemplate";
import Loader from "@/components/general/Loader";

export default {
  name: "Dataset._id",
  layout: 'main',
  middleware: "authRequired",
  mixins: [labelingTemplate],
  components: {Loader, Answers, DatasetItems, Transactions, Targets, DatasetsNav},
  data() {
    return {
      dataset: null,
      userHasChart: false,
      userCredit: 0,
      userAnswersCount: 0,
      userTotalAnswersCount: 0,

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

      try {
        const dataset = await this.$apiService.get('/api/Datasets/Get/' + this.$route.params.id);
        if(dataset.data) {
          this.dataset = dataset.data;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async getChartData() {
      this.loading = true;
      let lang = this.$langIsFa ? 'fa' : 'en';

      const data = {
        UserId: this.user.Id,
        DatasetId: this.$route.params.id,
        From: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
      }
      try {
        const datasets = await this.$apiService.get('/api/Reports/AnswersCountsTrend', data);
        if(datasets.status < 400 && datasets.data.length) {
          this.userHasChart = true;
          //this.dataset = dataset.data.result;

          let finalDataDates = [];
          let finalDataCounts = [];

          datasets.data.forEach(v => {
            finalDataDates.push(this.$moment(v.day).locale(lang).format('DD MMMM YY'));
            finalDataCounts.push(v.count);
          });

          let fillUpDates = [];

          let chartDates = [],
            chartCount = [];

          this.$nextTick(() => {
            setTimeout(() => {
              let ctx = document.getElementById('myChart');//.getContext('2d');

              let myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: finalDataDates,
                datasets: [{
                  label:  this.$t('GENERAL.TOTALLABELS') ,
                  data: finalDataCounts,
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
        UserId: this.user.id,
        DatasetId: ds
      }

      try {
        const credit = await this.$apiService.get('/api/Credit/GetCredit', data);
        if(credit.data && credit.data && credit.data.credit) {
          this.userCredit = credit.data.credit;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async convertScoreToMoney() {
      if(!this.userCredit) {
        let continueModal = Modal({
          title: this.$t('GENERAL.ERROR'),
          body: this.$t('TEXTS.SINGLEDATASETNOTSCOREDYET'),
          backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',

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
      this.loadingRequestCashout = true
      const data = {
        UserId: this.user.id,
        DatasetId: this.$route.params.id
      }
      try {
        const credit = await this.$apiService.post('/api/Credit/CollectCredit', data);
        console.log(credit)
        if(credit.data && credit.status < 400) {
          if(credit.data.CreditAmount > 0) {
            let continueModal = Modal({
              title: this.$t('GENERAL.TRANSFERSUCCESSFUL'),
              body: `
              ${credit.data.CreditAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}
                ${this.$t('TEXTS.SINGLEDATASETPOINTSTRANSFEREDMODAL')} `,
              backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
              fullscreen: true,
              actions: [
                {
                  title: this.$t('GENERAL.DASHBOARD'),
                  class: ['active'],
                  fn: async () => {
                    continueModal.close()
                    await this.$router.push("/dashboard")
                  },
                },
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

            document.getElementById('stats-credit').innerHTML = '0.00';
          }
        } else {
          if(credit.data && credit.data[0].code === 3400 ) {
              let alertModal = Modal({
                title: this.$t('GENERAL.TRANSFERERROR'),
                body: this.$t('TEXTS.SINGLEDATASETNOTREACHEDTARGET'),
                backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
                actions: [
                  {
                    title: this.$t('GENERAL.CLOSE'),
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
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingRequestCashout = false;
      }
    },
    async getUserAnswersCount(ds) {
      let data = {
        DatasetId: ds,
        UserId: this.user.Id,
        OnlyNonCalculated: true
      }

      try {
        const answers = await this.$apiService.get('/api/Answers/Stats', data);
        if(answers.status < 400) {
          this.userAnswersCount = answers.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
        async getUserTotalAnswersCount(ds) {
      let data = {
        DatasetId: ds,
        UserId: this.user.Id
      }

      try {
        const answers = await this.$apiService.get('/api/Answers/Stats', data);
        if(answers.status < 400) {
          this.userTotalAnswersCount = answers.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getDatasetTargets(datasetId) {
      let data = {
        DatasetId: datasetId
      }

      try {
        const targets = await this.$apiService.get('/api/TargetDefinitions/GetAll', data);
        if(targets.data && targets.data.items && targets.data.items.length) {
          this.datasetTargets = targets.data.items;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getUserTarget(datasetId) {
      let data = {
        DatasetId: datasetId,
        UserId: this.user.Id
      }

      try {
        const target = await this.$apiService.get('/api/Targets/GetCurrentTarget', data);
        if(target.data) {
          //let targetDefinition = await this.$apiService.get('/api/TargetDefinitions/Get/' + targets.data.items[0].targetDefinitionId, data);
          this.userTargetDefinition = target.data.TargetDefinition;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async changeUserTargetTo(target) {
      let data = {
        TargetDefinitionId: target.Id
      }

      //TODO: create new target ?
      try {
        const result = await this.$apiService.post('/api/Targets/ActivateTarget', data);
        if(result.status && result.status > 400) {
          if(result.data[0] && result.data[0].code === 3200) {
            let alertModal = Modal({
              title: this.$t('TEXTS.CHOOSETARGETERROR'),
              body: this.$t('TEXTS.NEWTARGETSHOULDBEBIGGERTHANOLDTARGET'),
              backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
              actions: [
                {
                  title: this.$t('GENERAL.CLOSE'),
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
          else if(result.data[0] && result.data[0].code === 3301) {
            let alertModal = Modal({
              title: this.$t('TEXTS.CHOOSETARGETERROR'),
              body: this.$t('TEXTS.YOUHAVEREACHEDYOURBUDGETONCURRENTDATASET'),
              backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
              actions: [
                {
                  title: this.$t('GENERAL.CLOSE'),
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
          else if(result.data[0] && result.data[0].code === 3204) {
            let alertModal = Modal({
              title: this.$t('TEXTS.CHOOSETARGETERROR'),
              body: this.$t('TEXTS.PLEASECOLLECTYOURPOINTSBEFORECONTINUING'),
              backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
              actions: [
                {
                  title: this.$t('GENERAL.CLOSE'),
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

        } else {
          this.getUserTarget(this.$route.params.id)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  async mounted() {
    this.getItem();
    this.getChartData();
    this.getUserCredit(this.$route.params.id);
    this.getUserAnswersCount(this.$route.params.id);
    this.getUserTotalAnswersCount(this.$route.params.id);
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

.dataset-history-wrapper button {
  display: flex;
}

.back-btn {
  display: flex;
  justify-content: center;
  color: #1c1c1c;
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



/**
Fire animation
*/
$fireColor: #ffe58a;//rgb(255,80,0);
$fireColorT: rgba(255,80,0,0);
$dur: 2s;
$blur: 0.02em;
$fireRad: 3em;
$parts: 10;
$partSize: 5em;


.fire {
  display: none;
  font-size: 24px;
  filter: blur($blur);
  -webkit-filter: blur($blur);
  margin: 3em auto 0 auto;
  position: relative;
  width: 10em;
  height: 12em;
}
.target-list-item {
  overflow: hidden;
  .row {
    z-index: 2;
    position: relative;
  }

  .fire {
    position:absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: .4;
  }

  &:hover {
    .fire {
      display: block;
    }
  }
}
.particle {
  animation: rise $dur ease-in infinite;
  background-image: radial-gradient($fireColor 20%,$fireColorT 70%);
  border-radius: 50%;
  mix-blend-mode: screen;
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: $partSize;
  height: $partSize;
  // spread particles out in time and x-position to get desired effect
  @for $p from 1 through $parts {
    &:nth-of-type(#{$p}) {
      animation-delay: $dur * random();
      left: calc((100% - #{$partSize}) * #{($p - 1)/$parts});
    }
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
  25% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(-10em) scale(0);
  }
}
</style>
