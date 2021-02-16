<template>
    <div class="container-old">
      <datasets-nav
        v-if="dataset && userTargetDefinition"

        :dataset="dataset"
        :target="userTargetDefinition"></datasets-nav>

      <div
        v-if="randomLabel && labelQuestions"

        class="row-old main">
        <div class="col-12-old grid-images-wrapper">
          <p class="question-text static">
            تصاویر
            <strong
              @click='() => { window.open(`https://www.google.com/search?tbm=isch&q="${labelType}" ${randomLabel.name.replace(/[0-9]/g, "").replace(/_/g, " ")}`); }'
              style="cursor: pointer;">
              {{ randomLabel.name.replace(/[0-9]/g, '').replace(/_/g, ' ') }}

               ({{ labelType }})
            </strong>
            را مشخص کنید.
          </p>
          <ol class="grid-images-list">
            <li
              v-for="item of labelQuestions"

              id="q-0"
              class="grid-images-list-items"
              :class="{
                'completed yes': item.answer && item.isYes,
                'completed no': item.answer && item.isNo,
                'completed report': item.answer && item.isReport,
              }"
              :style="{backgroundImage: `url(${$axios.defaults.baseURL}/file/dataset/item/${item.datasetItemId})`}">
              <div

                class="grid-images-overlay-bg">
                <div
                  @click="setItemAnswerTo(item, 'yes')"
                  class="grid-images-overlay-icons grid-images-overlay-yes"></div>
                <div
                  @click="setItemAnswerTo(item, 'no')"
                  class="grid-images-overlay-icons grid-images-overlay-no"></div>
                <div
                  @click="setItemAnswerTo(item, 'report')"
                  data-id="0"
                  class="grid-images-overlay-icons grid-images-overlay-report"></div>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div class="row-old footer grid-footer">
        <button
          @click="()=> window.location.reload()"
          class="answer">برو به لیست بعدی</button>
      </div>
    </div>
</template>

<script>
import DatasetsNav from "~/components/navbars/DatasetsNav";
import { mapGetters } from "vuex"

export default {
  name: "labeling_grid_id",
  layout: 'labeling',
  components: {DatasetsNav},
  computed: {
    ...mapGetters({
      user: "auth/currentUser"
    })
  },
  data() {
    return {
      dataset: null,
      datasetItem: null,
      randomLabel: null,
      labelType: '',
      labelQuestions: null,
      userTargetDefinition: null,
      window: window
    }
  },
  methods: {
    async getDataset() {
      let data = {
        id: this.$route.params.id,
      }

      try {
        const result = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Datasets/Get', data));
        if (result.data && result.data.result) {
          this.dataset = result.data.result
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getRandomLabel() {
      let data = {
        datasetId: this.$route.params.id,
        count: 1
      }

      //TODO: create new target ?
      try {
        const result = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Questions/GetRandomLabel', data));
        if (result.data && result.data.result) {
          this.randomLabel = result.data.result[0]
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getLabelQuestions() {
      if (!this.randomLabel)
        return;

      let data = {
        DataSetId: this.$route.params.id,
        Count: 9,
        LabelId: this.randomLabel.id,
      }

      try {
        const result = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Questions/GetQuestions', data));
        if (result.data && result.data.result) {
          console.log(result.data.result)
          this.labelQuestions = result.data.result;
          this.labelQuestions.forEach(item => {
            item.isYes = false;
            item.isNo = false;
            item.isReport = false;
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getUserTarget(datasetId) {
      let data = {
        datasetId: datasetId,
        ownerId: this.user.id,
        order: 'DESC',
        maxResultCount: 1
      }

      try {
        const targets = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/Targets/GetAll', data));
        if(targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
          data = {
            id: targets.data.result.items[0].targetDefinitionId
          };
          let targetDefinition = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/TargetDefinitions/Get', data));
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
    async getDatasetItem() {
      if(!this.labelQuestions)
        return
      let data = {
        id: this.labelQuestions[0].datasetItemId,
      }

      try {
        const result = await this.$axios.get(this.$utils.addParamsToUrl('/api/services/app/DatasetItems/Get', data));
        if (result.data && result.data.result) {
          this.datasetItem = result.data.result;

          //TODO: WTF ?
          let fieldName = this.datasetItem.filePath;
          fieldName = fieldName.split('\\')[4];
          switch (fieldName) {
            case 'Actors':
              this.labelType = 'بازیگر';
              break;

            case 'Singers':
              this.labelType = 'خواننده';
              break;

            case 'Politicians':
              this.labelType = 'سیاست مدار';
              break;
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    setItemAnswerTo(item, state){
        this.$set(item, 'answer', true);
        switch (state) {
          case 'yes':
            if(!item.isYes) {
              console.log('hi??')
              this.$set(item, 'isNo', false);
              this.$set(item, 'isYes', true);
              this.$set(item, 'isReport', false);
            } else  {
              item.isYes = false;
              item.answer = false;
            }
            break;
          case 'no':
            if(!item.isNo) {
              this.$set(item, 'isNo', true);
              this.$set(item, 'isYes', false);
              this.$set(item, 'isReport', false);
            } else  {
              item.isNo = false;
              item.answer = false;
            }
            break;
          case 'report':
            if(!item.isReport) {
              this.$set(item, 'isNo', false);
              this.$set(item, 'isYes', false);
              this.$set(item, 'isReport', true);
            } else  {
              item.isReport = false;
              item.answer = false;
            }
        }

    }
  },
  async mounted() {
    //Call orders matters
    await this.getDataset();
    await this.getRandomLabel();
    await this.getLabelQuestions();
    await this.getDatasetItem();
    await this.getUserTarget();
  }
}
</script>

<style scoped>
ol {
  padding: 0 !important;
}
</style>
