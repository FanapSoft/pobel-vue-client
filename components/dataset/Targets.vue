<template>
  <div>
    <h3>هدف گذاری</h3>
    <p>
      هدف خود برای برچسب زنی بر روی این مجموعه ی داده را مشخص کنید. توجه داشته باشید چنانچه هدف تعیین نشده باشد برچسب زنی ممکن نمی باشد و اعتبار فرآیند برچسب زنی نیز بدرستی محاسبه نمی گردد.
      با تعیین هدف توسط فرم زیر مشخص کنید در نظر دارید چه تعداد پاسخ در این مجموعه‌ی داده ثبت کنید.
    </p>
    <ul v-if="targets">
      <li
        :key="index"
        v-for="(item, index) in targets">targe 1</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "targets",
  data(){
    return {
      targets: null
    }
  },
  methods: {
    async getItems() {
      this.loading = true;

      const data = {
        DatasetId: this.$route.params.DatasetId
      }
      try {
        const targets = await this.$apiService.get(`/api/TargetDefinitions/GetAll`, data);
        if(targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
          this.targets = targets.data.result.items
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>

</style>
