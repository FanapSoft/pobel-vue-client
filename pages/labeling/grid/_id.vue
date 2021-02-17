<template>
    <div class="container-old">
      <div
        v-if="!dataset || !userTargetDefinition"

        style="display: flex; align-items: center; justify-content: center;">
        <v-progress-linear
          indeterminate

          size="20"
          color="#ff257c"></v-progress-linear>
      </div>
      <datasets-nav
        v-else

        :dataset="dataset"
        :target="userTargetDefinition"
        @totalSeconds="tm => timer = tm"></datasets-nav>

      <div
        v-if="!randomLabel || !labelQuestions"

        style="display: flex; align-items: center; justify-content: center;margin-top: 20px">
        <v-progress-circular
          indeterminate

          size="30"
          color="#ff257c"></v-progress-circular>
      </div>
      <div
        v-else

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
                'completed yes': item.answer !== -1 && item.isYes,
                'completed no': item.answer !== -1 && item.isNo,
                'completed report': item.isReport,
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
          v-if="!userAnswers"

          @click="()=> window.location.reload()"

          class="answer">برو به لیست بعدی</button>

        <button
          v-else

        @click="submitAnswers">ارسال پاسخ ها</button>
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
      window: window,
      timer: null,
      userAnswers: null,
    }
  },
  methods: {
    async getDataset() {
      const data = {
        id: this.$route.params.id,
      }
      try {
        const result = await this.$apiService.get('/api/services/app/Datasets/Get', data);

        if (result.data && result.data.result) {
          this.dataset = result.data.result
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getRandomLabel() {
      const data = {
        datasetId: this.$route.params.id,
        count: 1
      }

      //TODO: create new target ?
      try {
        const result = await this.$apiService.get('/api/services/app/Questions/GetRandomLabel', data);
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
        const result = await this.$apiService.get('/api/services/app/Questions/GetQuestions', data);
        if (result.data && result.data.result) {
          this.labelQuestions = result.data.result;
          this.labelQuestions.forEach(item => {
            this.$set(item, "isYes", false);
            this.$set(item, "isNo", false);
            this.$set(item, "isReport", false);
            this.$set(item, "answer", -1);
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
        const targets = await this.$apiService.get('/api/services/app/Targets/GetAll', data);
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
        const result = await this.$apiService.get('/api/services/app/DatasetItems/Get', data);
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
    async submitAnswers() {
      let answers = [], finalAnswers = [];
      answers = this.labelQuestions.filter(item => item.answer !== -1);
      //TODO: make sure user can not reach here without answers
      if(answers.length) {
        finalAnswers = answers.map(item => {
          //TODO: improve it for questions with more than yes and no answer options
          return {
            dataSetId: (item.answer === 0 ? item.options[0].dataSetId : item.options[1].dataSetId),
            dataSetItemId: item.datasetItemId,
            answerIndex: (item.answer === 0 ?  item.options[0].index : item.options[1].index),
            durationToAnswerInSeconds: Math.round(this.timer/this.labelQuestions.length)
          }
        });
        let data = {
          answers: answers
        }

        try{
          const submitionResult = await this.$apiService.post("/api/services/app/Answers/SubmitBatchAnswer", data)
          window.location.reload();
        } catch (error) {
          console.log(error)
        }
      }
      //let reports = [];
/*      answers = this.labelQuestions.filter(item => item.answer === true);
      //TODO: make sure user can not reach here without answers
      if(answers.length) {
        let data = {
          answers: answers
        }

        try{
          const submitionResult = await this.$apiService.post("/api/services/app/Answers/SubmitBatchAnswer", data)
          window.location.reload();
        } catch (error) {
          console.log(error)
        }
      }*/
    },
    /*pushItemToUserAnswers(item) {
      this.userAnswers.push({
        id: item.id,
        answer: item.answer,

      })
    },*/
    setItemAnswerTo(item, state) {
      switch (state) {
          case 'yes':
            if(!item.isYes) {
              item.isNo = false;
              item.isReport = false;
              item.isYes = true;
              item.answer = 0;
            } else  {
              item.isYes = false;
              item.isNo = false;
              item.isReport = false;
              item.answer = -1;
            }
            break;
          case 'no':
            if(!item.isNo) {
              item.isYes = false;
              item.isNo = true;
              item.isReport = false;
              item.answer = 1;
            } else  {
              item.isYes = false;
              item.isNo = false;
              item.isReport = false;
              item.answer = -1;
            }
            break;
          case 'report':
            if(!item.isReport) {
              item.isYes = false;
              item.isNo = false;
              item.isReport = true;
              item.answer = -1;
            } else  {
              item.isYes = false;
              item.isNo = false;
              item.isReport = false;
              item.answer = -1;
            }
            break
      }
    }
  },
  async mounted() {
    //Call orders matters
    await this.getDataset();
    await this.getUserTarget();
    await this.getRandomLabel();
    await this.getLabelQuestions();
    await this.getDatasetItem();
  }
}
</script>

<style scoped>
ol {
  padding: 0 !important;
}
</style>
