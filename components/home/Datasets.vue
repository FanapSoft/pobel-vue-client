<template>
  <div id="pobel-preview-datasets" class="row-old">
    <div class="col-12-old">
      <h3>مجموعه داده‌ها</h3>
      <div class="datasets-list mini">
        <!--          {{#datasets}}-->
        <div
          :key="index"
          v-for="(ds, index) of datasets"

          class="col-4-old col-6-sm-old datasets-list-items">
          <div

            class="dataset-cover"
               :style="{'background-image': `url(${$axios.defaults.baseURL}/file/dataset/item/${ds.randomItemId})`}"
               :id="`ds-cover-${ds.id}`">
            <!--              {{#labelingStatus}}-->
            <span
              v-if="ds.labelingStatus"
              class="dataset-labeling-status" data-title="وضعیت برچسب زنی فعال است"></span>
            <!--              {{/labelingStatus}}-->
          </div>

          <NuxtLink class="title" style="font-family: 'IranSans';" :to="`/dataset/${ds.id}`" :data-title="ds.name">{{ds.name}}</NuxtLink>
          <NuxtLink class="title" :to="`/dataset/${ds.id}`" :data-title="ds.name">
            <small :data-title="ds.description">{{ds.description}}</small>
          </NuxtLink>
          <!--        <a class="title" href="/dataset/{{id}}" data-title="{{name}}">{{name}}</a>-->
          <!--        <a class="title" href="/dataset/{{id}}"><small data-title="{{description}}">{{description}}</small></a>-->

          <div class="row-old">
            <div class="col-6-old" style="flex: none">
              <p>
                کل آیتم‌ها
                <br/>
                <strong>{{ds.itemsCount? ds.itemsCount : '0'}}</strong></p>
            </div>
            <div class="col-6-old" style="flex: none">
              <p class="left-in-mobile">
                وضعیت
                <br/>
                <!--                  <strong>{{#labelingStatus}}فعال{{/labelingStatus}}{{^labelingStatus}}غیرفعال{{/labelingStatus}}</strong>-->
                <strong
                  v-if="ds.labelingStatus">فعال</strong>
                <strong
                  v-else>غیرفعال</strong>
              </p>
            </div>
          </div>

        </div>
        <!--          {{/datasets}}-->
      </div>
    </div>
  </div>
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
        const datasets = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Reports/DataSets', data));
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

<style scoped>

</style>
