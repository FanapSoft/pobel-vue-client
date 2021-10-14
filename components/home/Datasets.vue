<template>
  <v-row id="pobel-preview-datasets">
    <v-col class="px-0">
      <h3>{{ $t('DATASET.DATASETSPER')}}</h3>
      <v-row class="datasets-list mini">
        <v-col
          :key="index"

          v-for="(ds, index) of datasets"

          cols="12" sm="4"
          >
          <div class="datasets-list-items">
            <div
              :style="{'background-image': (ds.RandomItemId && ds.Type === 1 ? `url(${$axios.defaults.baseURL}/api/File/Dataset/Item/${ds.RandomItemId})` : ''), 'background-size':  (ds.RandomItemId && ds.Type === 1 ? 'auto' : '')}"
              :id="`ds-cover-${ds.Id}`"

              class="dataset-cover">
              <span
                v-if="ds.LabelingStatus"

                class="dataset-labeling-status" data-title="وضعیت برچسب زنی فعال است"></span>
            </div>

            <NuxtLink class="title pb-0" style="font-family: 'IranSans';" :to="`/dataset/${ds.Id}`" :data-title="ds.Name">{{ds.Name}}</NuxtLink>
            <NuxtLink class="title pt-1" :to="`/dataset/${ds.Id}`" :data-title="ds.Name">
              <small style="margin-top: 0; " :data-title="ds.Description">{{ds.Description}}</small>
            </NuxtLink>
            <v-row>
              <v-col cols="6" style="flex: none">
                <p>
                  {{$t('GENERAL.ITEMS')}}
                  <br/>
                  <strong>{{ds._count ? ds._count.DatasetItems.toLocaleString() : '0'}}</strong>
                </p>
              </v-col>
              <v-col cols="6" style="flex: none">
                <p class="left-in-mobile">
                  {{$t('GENERAL.STATUS')}}
                  <br/>
                  <strong
                    v-if="ds.LabelingStatus">{{$t('GENERAL.ACTIVE')}}</strong>
                  <strong
                    v-else>{{$t('GENERAL.INACTIVE')}}</strong>
                </p>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "datasets",
  data() {
    return {
      datasets: null,
      loading: false,
      dsCount: 0
    };
  },
  methods: {
    async getItems() {
      this.loading = true;
      const data = {
        Limit: 3,
        IncludeRandomItem: true,
        IsActive: true,
        IncludeItemsCount: true
      }
      try {
        const datasets = await this.$apiService.get('/api/Datasets/GetAll', data);
        if(datasets.status < 400 && datasets.data.items && datasets.data.items.length) {
          this.datasets = datasets.data.items;
          this.dsCount = datasets.data.totalCount;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    }
  },
  mounted() {
    this.getItems()
  }
}
</script>

<style lang="scss" scoped>
.left-in-mobile{
  text-align: left !important;
}

.ltr {
  .left-in-mobile{
    text-align: right !important;
  }
}
.datasets-list .dataset-cover {
  background-image: url('~assets/images/noimage.png');
  background-size: contain;
}
</style>

<style>

</style>
