<template>
  <v-row id="pobel-preview-datasets">
    <v-col class="px-0">
      <h3>مجموعه داده‌ها</h3>
      <v-row class="datasets-list mini">
        <v-col
          :key="index"

          v-for="(ds, index) of datasets"

          cols="12" sm="4"
          >
          <div class="datasets-list-items">
            <div
              :style="{'background-image': `url(${$axios.defaults.baseURL}/file/dataset/item/${ds.randomItemId})`}"
              :id="`ds-cover-${ds.id}`"

              class="dataset-cover">
              <span
                v-if="ds.labelingStatus"

                class="dataset-labeling-status" data-title="وضعیت برچسب زنی فعال است"></span>
            </div>

            <NuxtLink class="title pb-0" style="font-family: 'IranSans';" :to="`/dataset/${ds.id}`" :data-title="ds.name">{{ds.name}}</NuxtLink>
            <NuxtLink class="title pt-1" :to="`/dataset/${ds.id}`" :data-title="ds.name">
              <small style="margin-top: 0; " :data-title="ds.description">{{ds.description}}</small>
            </NuxtLink>
            <v-row>
              <v-col cols="6" style="flex: none">
                <p>
                  کل آیتم‌ها
                  <br/>
                  <strong>{{ds.itemsCount ? ds.itemsCount.toLocaleString() : '0'}}</strong></p>
              </v-col>
              <v-col cols="6" style="flex: none">
                <p class="left-in-mobile">
                  وضعیت
                  <br/>
                  <strong
                    v-if="ds.labelingStatus">فعال</strong>
                  <strong
                    v-else>غیرفعال</strong>
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
        MaxResultCount: 3
      }
      try {
        const datasets = await this.$apiService.get('/api/services/app/Reports/DataSets', data);
        if(datasets.data && datasets.data.result && datasets.data.result.items && datasets.data.result.items.length) {
          this.datasets = datasets.data.result.items;
          this.dsCount = datasets.data.result.totalCount;
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
</style>
