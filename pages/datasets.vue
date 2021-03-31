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
      <h2 :class="{'mr-7': $isRTL, 'ml-7': !$isRTL }">دیتاست ها</h2>
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
              :style="{'background-image': (ds.coverItem ? `url(${$axios.defaults.baseURL}/file/dataset/item/${ds.coverItem.id})` : 'none')}"
              :id="`ds-cover-${ds.id}`">
            <span
              v-if="ds.labelingStatus"
              class="dataset-labeling-status" data-title="وضعیت برچسب زنی فعال است"></span>
            </div>

            <NuxtLink class="title" style="font-family: 'IranSans';" :to="`/dataset/${ds.id}`" :data-title="ds.name">
              {{ ds.name }}
            </NuxtLink>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <p >
                    <span style="display: flex;">
                    <span>{{ $t('GENERAL.TARGET') }}</span><span>/</span><strong>{{ $t('GENERAL.ANSWER') }}</strong>
                    </span>
                    <span :id="`ds-ur-answers-${ds.id}`" style="display: flex; ">
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
                  <p class="left-in-mobile">اعتبار
                    <br/>
                    <span :id="`ds-credit-${ds.id}`">{{ $utils.formatNumber($utils.toFixed(ds.userCredit)) }}</span>
                    {{ $t('GENERAL.IRR') }}</p>
                </v-col>
              </v-row>
            </v-container>

            <!-- Actions -->
            <div
              v-if="ds.targetSize && ds.userAnswersCount && ds.userAnswersCount <= ds.targetSize"
              class="row-old dataset-actions-list" :id="`ds-{{id}}`">
              <div
                v-if="ds.labelingStatus"

                class="col-12-old">
                <NuxtLink :to="`/labeling/grid/${ds.id}`" class="start-btn">{{ $t('GENERAL.START') }}</NuxtLink>
              </div>
              <div
                v-else

                class="col-12-old">
                <a href="" class="start-btn disabled">غیرفعال است</a>
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
        //MaxResultCount: 3
      }
      try {
        const datasets = await this.$apiService.get('/api/services/app/DataSets/GetAll', data);
        if (datasets.data && datasets.data.result && datasets.data.result.items && datasets.data.result.items.length) {
          for (let item of datasets.data.result.items) {
            item.answerBudgetCountPerUser = this.$utils.formatNumber(this.$utils.toFixed(item.answerBudgetCountPerUser)); //item.answerBudgetCountPerUser.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            item.coverItem = await this.getDatasetCoverItem(item.id);
            item.targetSize = await this.getUserTarget(item.id);
            if (item.targetSize) {
              item.userAnswersCount = await this.getUserAnswersCount(item.id);

              if (item.userAnswersCount) {
                item.userCredit = await this.getUserCredit(item.id);
              }
            }
          }

          this.datasets = datasets.data.result.items;
          this.dsCount = datasets.data.result.totalCount;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    async getDatasetCoverItem(id) {
      const data = {
        DataSetId: id,
        SkipCount: 0,//Math.floor(Math.random() * ds.data.result.totalCount),
        MaxResultCount: 1
      }

      //TODO: needs improvement
      try {
        let datasetItems = await this.$apiService.get('/api/services/app/DataSetItems/GetAll', data);
        if (datasetItems.data && datasetItems.data.result && datasetItems.data.result.items) {
          data.SkipCount = Math.floor(Math.random() * datasetItems.data.result.totalCount);
          datasetItems = await this.$apiService.get('/api/services/app/DataSetItems/GetAll', data);
          return (datasetItems.data.result ? datasetItems.data.result.items[0] : null)
        }
      } catch (error) {
        console.log(error);
      }

      return null;
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
        if (targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
          data = {
            id: targets.data.result.items[0].targetDefinitionId
          };
          let targetDefinition = await this.$apiService.get('/api/services/app/TargetDefinitions/Get', data);
          //if(targetDefinition.data && targetDefinition.data.result) {
          return (targetDefinition.data.result ? targetDefinition.data.result.answerCount : '0');
          //}
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getUserAnswersCount(ds) {
      let data = {
        datasetId: ds,
        UserId: this.user.id,
      }

      try {
        const answers = await this.$apiService.post('/api/services/app/Answers/Stats', data);
        if (answers.data && answers.data.result) {
          return answers.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }

      return 0;
    },
    async getUserCredit(ds) {
      let data = {
        userId: this.user.id,
        dataSetId: ds
      }

      try {
        const credit = await this.$apiService.get('/api/services/app/Credit/GetCredit', data);
        if (credit.data && credit.data.result) {
          return credit.data.result.credit;
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
