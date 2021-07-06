<template>
  <v-container class="datasets-wrapper" style="max-width: 60rem;">
    <div
      style="display: flex; align-items: center; justify-content: center;"
      v-if="!datasets">
      <v-progress-circular
        indeterminate

        size="50"
        color="#ff257c"></v-progress-circular>
    </div>
    <template v-else>
      <h2 :class="{'mr-7': $isRTL, 'ml-7': !$isRTL }">{{ $t('DATASET.DATASETSEN') }}</h2>
      <v-row class="datasets-list px-8 mt-4">

        <v-col
          :key="index"

          v-for="(ds, index) of datasets"

          cols="12"
          sm="4"
          class="  ">
          <div class="datasets-list-items">
            <div

              class="dataset-cover"
              :style="{'background-image': (ds.RandomItemId ? `url(${$axios.defaults.baseURL}/api/File/Dataset/Item/${ds.RandomItemId})` : 'none')}"
              :id="`ds-cover-${ds.id}`">
            <span
              v-if="ds.LabelingStatus"
              class="dataset-labeling-status" data-title="وضعیت برچسب زنی فعال است"></span>
            </div>

            <NuxtLink class="title" style="font-family: 'IranSans';" :to="`/dataset/${ds.Id}`" :data-title="ds.Name">
              {{ ds.Name }}
            </NuxtLink>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <p class="mb-0">
                    <span style="display: flex;">
                    <span>{{ $t('GENERAL.TARGET') }}</span><span>/</span><strong>{{ $t('GENERAL.ANSWER') }}</strong>
                    </span>
                    <span :id="`ds-ur-answers-${ds.Id}`" style="display: flex; ">
                      <template
                        v-if="ds.targetSize && ds.userAnswersCount">
                        <span>{{$utils.formatNumber(ds.targetSize) }}</span><span>/</span><strong>{{ $utils.formatNumber(ds.userAnswersCount) }}</strong>
                      </template>
                      <template
                        v-else>
                        0/0
                      </template>
                    </span>
                  </p>
                </v-col>
                <v-col cols="6">
                  <p class="left-in-mobile mb-0">{{$t('GENERAL.CREDIT')}}
                    <br/>
                    <span :id="`ds-credit-${ds.Id}`">{{ $utils.formatNumber($utils.toFixed(ds.userCredit)) }}</span>
                    {{ $t('GENERAL.IRT') }}</p>
                </v-col>
              </v-row>
            </v-container>

            <!-- Actions -->
            <div
              v-if="ds.targetSize && ds.userAnswersCount && ds.userAnswersCount <= ds.targetSize"
              class="row-old dataset-actions-list" :id="`ds-{{id}}`">
              <div
                v-if="ds.LabelingStatus"

                class="col-12-old">
                <NuxtLink :to="`/labeling/grid/${ds.Id}`" class="start-btn text-center">{{ $t('GENERAL.START') }}</NuxtLink>
              </div>
              <div
                v-else

                class="col-12-old">
                <a href="" class="start-btn disabled">{{ $t('GENERAL.INACTIVE') }}</a>
              </div>
            </div>
          </div>

        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import NavbarType1 from "../components/navbars/NavbarType1";
import {mapGetters} from "vuex"

export default {
  components: {NavbarType1},
  name: "datasets",
  layout: 'main',
  middleware: "authRequired",
  data() {
    return {
      datasets: null,
      loading: false,
      dsCount: 0
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/currentUser"
    })
  },
  methods: {
    async getItems() {
      this.loading = true;
      const data = {
        //Limit: 3
        IsActive: true,
        IncludeRandomItem: true
      }
      try {
        const datasets = await this.$apiService.get('/api/Datasets/GetAll', data);
        if (datasets.data && datasets.data.items && datasets.data.items.length) {
          for (let item of datasets.data.items) {
            item.AnswerBudgetCountPerUser = this.$utils.formatNumber(this.$utils.toFixed(item.AnswerBudgetCountPerUser)); //item.answerBudgetCountPerUser.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //item.coverItem = await this.getDatasetCoverItem(item.Id);
            item.targetSize = await this.getUserTarget(item.Id);
            console.log(item.targetSize)
            if (item.targetSize) {
              item.userAnswersCount = await this.getUserAnswersCount(item.Id);

              if (item.userAnswersCount) {
                item.userCredit = await this.getUserCredit(item.Id);
              }
            }
          }

          this.datasets = datasets.data.items;
          this.dsCount = datasets.data.totalCount;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async getDatasetCoverItem(id) {
      const data = {
        DatasetId: id,
        Skip: 0,//Math.floor(Math.random() * ds.data.result.totalCount),
        Limit: 1
      }

      //TODO: needs improvement
      try {
        let datasetItems = await this.$apiService.get('/api/DatasetItems/GetAll', data);
        if (datasetItems.data && datasetItems.data.items) {
          data.Skip = Math.floor(Math.random() * datasetItems.data.totalCount);
          datasetItems = await this.$apiService.get('/api/DatasetItems/GetAll', data);
          return (datasetItems.data ? datasetItems.data.items[0] : null)
        }
      } catch (error) {
        console.log(error);
      }

      return null;
    },
    async getUserTarget(datasetId) {
      let data = {
        DatasetId: datasetId,
        UserId: this.user.Id
      }

      try {
        const target = await this.$apiService.get('/api/Targets/GetCurrentTarget', data);
        if (target.data) {
          // data = {
          //   id: targets.data.result.items[0].targetDefinitionId
          // };

          //let targetDefinition = await this.$apiService.get('/api/TargetDefinitions/Get/' + targets.data.result.items[0].targetDefinitionId, data);
          //if(targetDefinition.data && targetDefinition.data.result) {
          return (target.data ? target.data.TargetDefinition.AnswerCount : '0');
          //}
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getUserAnswersCount(ds) {
      let data = {
        DatasetId: ds,
        UserId: this.user.id,
      }

      try {
        const answers = await this.$apiService.get('/api/Answers/Stats', data);
        if (answers.data) {
          return answers.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getUserCredit(ds) {
      let data = {
        UserId: this.user.Id,
        DatasetId: ds
      }

      try {
        const credit = await this.$apiService.get('/api/Credit/GetCredit', data);
        if (credit.data) {
          return credit.data.credit;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },

  },
  mounted() {
    this.getItems()
  }
}
</script>

<style scoped>
</style>
