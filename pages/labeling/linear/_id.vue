<template>
  <v-container>
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
      :localAnswersCount="localAnswersCount"
      @totalSeconds="tm => timer = tm"></datasets-nav>

    <div
      v-if="!labelQuestions"

      style="display: flex; align-items: center; justify-content: center;margin-top: 20px">
      <v-progress-circular
        indeterminate

        size="30"
        color="#ff257c"></v-progress-circular>
    </div>
    <div
      v-else

      class="row-old main">
      <div class="col-9-old">
        <div

          class="question-wrapper">
          <p class="question-text static">
            {{$t('TEXTS.LABELINGLINEARQUESTIONPART1')}}
            <strong

              @click='() => { window.open(`https://www.google.com/search?tbm=isch&q="${labelType}" ${labelQuestions[currentActiveItemIndex].title.replace(/[0-9]/g, "").replace(/_/g, " ")}`); }'

              style="cursor: pointer;">
              {{ labelQuestions[currentActiveItemIndex].title.replace(/[0-9]/g, '').replace(/_/g, ' ') }}

              ({{ labelType }})
            </strong>
            {{$t('TEXTS.LABELINGLINEARQUESTIONPART2')}}
          </p>
          <img
            :src="`${$axios.defaults.baseURL}/file/dataset/item/${labelQuestions[currentActiveItemIndex].datasetItemId}`"

            class="question-image">
        </div>
        <div

          class="answer-wrapper">
          <div class="yes-no-type">
            <button
              @click="setItemAnswerTo('yes')"

              id="yesBtn"
              data-id="0">
              بلی
              <svg width="24" height="24" viewBox="0 0 24 24">
                <defs>
                  <path id="thumbs-up-path"
                        d="M21.367 8.2c-.506-.6-1.215-1.1-2.025-1.2h-5.165V4c0-2.2-1.823-4-4.05-4-.405 0-.81.2-.912.6L5.468 9h-2.43C1.316 9 0 10.3 0 12v7c0 1.7 1.316 3 3.038 3h14.481c1.519 0 2.734-1.1 3.038-2.5l1.418-9c.1-.8-.102-1.6-.608-2.3zM5.063 20H3.038c-.608 0-1.013-.4-1.013-1v-7c0-.6.405-1 1.013-1h2.025v9zm13.469-.8c-.102.5-.507.8-1.013.8H7.089v-9.8l3.645-8.1c.81.3 1.418 1 1.418 1.9v4c0 .6.405 1 1.013 1h5.974c.304 0 .507.2.71.4.202.2.202.5.202.7l-1.52 9.1z"></path>
                </defs>
                <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                  <mask id="thumbs-up" fill="#fff">
                    <use xlink:href="#thumbs-up-path"></use>
                  </mask>
                  <g fill="#4A4A4A" mask="url(#thumbs-up)">
                    <path d="M-1-1h24v24H-1z"></path>
                  </g>
                </g>
              </svg>
            </button>
            <button @click="setItemAnswerTo('skip')">نمی دانم</button>
            <button
              @click="setItemAnswerTo('no')"
              id="noBtn">
              خیر
              <svg width="24" height="24" viewBox="0 0 24 24">
                <defs>
                  <path id="thumbs-down-path" d="M22 2.913C21.797 1.205 20.38 0 18.658 0H4.48C2.96 0 1.745 1.105 1.442 2.511L.024 11.553c-.203 1.607.911 3.214 2.532 3.415h5.266v3.014c0 2.21 1.823 4.018 4.05 4.018.406 0 .81-.2.912-.603l3.747-8.438h2.026c1.721 0 3.14-1.206 3.342-2.913V3.014c.101 0 .101-.1.101-.1zm-7.09 8.94l-3.645 8.138c-.81-.302-1.418-1.005-1.418-1.909v-4.018c0-.603-.405-1.005-1.012-1.005H3.062h-.203c-.506-.1-.911-.602-.81-1.105l1.418-9.04c.101-.503.506-.905 1.013-.905h10.43v9.845zm5.065-1.908c-.102.603-.71 1.105-1.317 1.105h-1.722V2.01h1.722c.608 0 1.215.501 1.317 1.104v6.831z"></path>
                </defs>
                <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                  <mask id="thumbs-down-mask" fill="#fff">
                    <use xlink:href="#thumbs-down-path"></use>
                  </mask>
                  <g fill="#4A4A4A" mask="url(#thumbs-down-mask)">
                    <path d="M-1-1h24v24H-1z"></path>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="col-3-old">
        <ul class="question-history">
          <li
            v-for="(item, index) of labelQuestions"

            :class="{
                'completed yes': item.answer !== -1 && item.isYes,
                'completed no': item.answer !== -1 && item.isNo,
                'completed skip':  item.isSkip,
                'completed report': item.isReport,
                'active': item.isCurrent,
              }"
            @click="activateCurrentQuestion(item)"

            class="question-list-items ">
            <span
              class="question-history-avatar"

              :style="{backgroundImage: `url(${$axios.defaults.baseURL}/file/dataset/item/${item.datasetItemId})`}"></span>
            <span
            class="question-history-text"></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="row footer">
      <button
        v-if="!localAnswersCount && !localReportsCount"

        @click="changeQuestion"

        class="answer">{{ $t('GENERAL.GOTONEXTLIST') }}</button>
      <button
        v-else

        @click="submitAnswers">{{ $t('GENERAL.SUBMITANSWERS') }}</button>

      <button
        @click="setItemAnswerTo('report')">
        {{ $t('GENERAL.REPORT') }}
        <svg width="24" height="24" viewBox="0 0 24 24"><defs><path id="flag-a" d="M20.4 2.1c-.4-.2-.8-.1-1.1.2 0 0-.9.7-3.3.7-1.3 0-2.4-.5-3.6-.9C11.1 1.5 9.7 1 8 1 4.8 1 3.5 2.1 3.3 2.3c-.2.2-.3.4-.3.7v19c0 .6.4 1 1 1s1-.4 1-1v-6.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9 1.3.5 2.7 1.1 4.4 1.1 3.2 0 4.5-1.1 4.7-1.3.2-.2.3-.4.3-.7V3c0-.4-.2-.7-.6-.9zM19 14.5c-.4.2-1.4.5-3 .5-1.3 0-2.4-.5-3.6-.9C11.1 13.5 9.7 13 8 13c-1.3 0-2.3.2-3 .4V3.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9C12.9 4.5 14.3 5 16 5c1.3 0 2.3-.2 3-.4v9.9z"></path></defs><g fill="none" fill-rule="evenodd"><mask id="flag-b" fill="#fff"><use xlink:href="#flag-a"></use></mask><use fill="#000" fill-rule="nonzero" xlink:href="#flag-a"></use><g fill="#4A4A4A" mask="url(#flag-b)"><path d="M0 0h24v24H0z"></path></g></g></svg>
      </button>
    </div>
  </v-container>
</template>

<script>
import DatasetsNav from "~/components/navbars/DatasetsNav";
import Modal from "../../../plugins/external/Modal";
import {mapGetters} from "vuex";

export default {
  name: "labeling_linear_id",
  layout: 'default',
  components: {DatasetsNav},
  middleware: "authRequired",
  computed: {
    ...mapGetters({
      user: "auth/currentUser"
    }),
    currentActiveItem() {
      if(!this.labelQuestions)
        return 0;
      return this.labelQuestions.filter(item => item.isCurrent === true)[0]
    },
    currentActiveItemIndex() {
      let index = 0
      if(!this.labelQuestions)
        return index;

      return this.labelQuestions.findIndex(item=> item.isCurrent === true)
    },
  },
  data() {
    return {
      dataset: null,
      datasetItem: null,
      currentQuestionLabel: null,
      labelType: '',
      labelQuestions: null,
      userTargetDefinition: null,
      window: window,
      timer: null,
      localAnswersCount: 0,
      localReportsCount: 0,
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
    /*async getCurrentQuestionLabel() {
      const data = {
        datasetId: this.$route.params.id,
        count: 1
      }

      //TODO: create new target ?
      try {
        const result = await this.$apiService.get('/api/services/app/Questions/GetQuestion', data);
        if (result.data && result.data.result) {
          this.currentQuestionLabel = result.data.result[0]
        }
      } catch (error) {
        console.log(error)
      }
    },*/
    async getLabelQuestions() {
      let data = {
        DataSetId: this.$route.params.id,
        Count: 7,
        //LabelId: this.currentQuestionLabel.id,
      }

      try {
        const result = await this.$apiService.get('/api/services/app/Questions/GetQuestions', data);
        if (result.data && result.data.result) {
          this.labelQuestions = result.data.result;
          this.labelQuestions.forEach((item, index) => {
            if(!index)
              this.$set(item, "isCurrent", true);
            else
              this.$set(item, "isCurrent", false);

            this.$set(item, "isYes", false);
            this.$set(item, "isNo", false);
            this.$set(item, "isSkip", false);
            this.$set(item, "isReport", false);
            this.$set(item, "answer", -1);
          })
        } else {
          if(result.data && result.data.error && result.data.error.message ) {
            if(result.data.error.message.indexOf("No target has been defined.") !== -1) {
              this.$router.push("/dataset/" + this.$route.params.id)
            }
          }
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
          let targetDefinition = await this.$apiService.get('/api/services/app/TargetDefinitions/Get', data);
          this.userTargetDefinition = targetDefinition.data.result;
          this.$set(this.userTargetDefinition, 'currentUserAnswersCount', 0);

          await this.getUserAnswersCount();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUserAnswersCount() {
      ///api/services/app/Answers/Stats

      let data = {
        dataSetId: this.$route.params.id,
        UserId: this.user.id
      }

      try {
        const answerStat = await this.$apiService.post('/api/services/app/Answers/Stats', data);
        if(answerStat.data && answerStat.data.result ) {
          console.log()
          this.userTargetDefinition.currentUserAnswersCount = answerStat.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
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
              this.labelType = this.$t('GENERAL.ACTOR');
              break;

            case 'Singers':
              this.labelType = this.$t('GENERAL.SINGER');
              break;

            case 'Politicians':
              this.labelType = this.$t('GENERAL.POLITICIAN');
              break;
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async submitAnswersToServer() {
      let isAnswersSubmitted = false, answers = [], finalAnswers = [];
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
          answers: finalAnswers
        }

        try{
          const submitionResult = await this.$apiService.post("api/services/app/Answers/SubmitBatchAnswer", data)
          isAnswersSubmitted = true;
        } catch (error) {
          console.log(error)
        }
      }
      /*let reports = null;
      reports = this.labelQuestions.filter(item => item.isReport === true);
      if(reports) {
        let data = {
          answers: finalAnswers
        }

        try{
          //const submitionResult = await this.$apiService.post("api/services/app/Answers/SubmitBatchAnswer", data)
          isAnswersSubmitted = true;
        } catch (error) {
          console.log(error)
        }
      }*/
    },
    async submitAnswers() {
      let continueModal = Modal({
        title: this.$t('GENERAL.SUBMITANSWERSANDCONTINUE'),
        body: this.$t('TEXTS.LABELINGSUBMITANSWERSANDCOUNTINUE'),
        fullscreen: true,
        actions: [
          {
            title: this.$t('GENERAL.SUBMITANSWERSANDCONTINUE'),
            class: ['active'],
            fn: async () => {
              await this.submitAnswersToServer();
              this.changeQuestion();
              continueModal.close();
            },
            timeout: 5000
          },
          {
            title: this.$t('GENERAL.NORETURN'),
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
    },
    updateLocalAnswersCount() {
      this.localAnswersCount = 0;
      this.localReportsCount = 0;
      if(this.labelQuestions) {
        for (let i of this.labelQuestions) {
          if (i.answer !== -1 && (i.isYes || i.isNo)) {
            this.localAnswersCount++
          } else if(i.answer === -1 && i.isReport) {
            this.localReportsCount++;
          }
        }
      }
    },
    setItemAnswerTo(state) {
      let item = this.currentActiveItem
      switch (state) {
        case 'yes':
            item.isNo = false;
            item.isSkip = false;
            item.isReport = false;
            item.isYes = true;
            item.answer = 0;
          break;
        case 'no':
            item.isYes = false;
            item.isNo = true;
            item.isSkip = false;
            item.isReport = false;
            item.answer = 1;
          break;
        case 'report':

            item.isYes = false;
            item.isNo = false;
            item.isSkip = false;
            item.isReport = true;
            item.answer = -1;

          break
        case 'skip':
            item.isYes = false;
            item.isNo = false;
            item.isSkip = true;
            item.isReport = false;
            item.answer = -1;
          break
      }
      //this.getCurrentQuestionLabel()
      this.activateNextItem();
    },
    activateNextItem(){
      let currentIndex = this.currentActiveItemIndex;

      if(currentIndex < this.labelQuestions.length - 1)
        this.labelQuestions[currentIndex + 1].isCurrent = true;
      else
        this.labelQuestions[0].isCurrent = true;

      this.labelQuestions[currentIndex].isCurrent = false;

    },
    activateCurrentQuestion(item) {
      //Deactivate all others
      this.labelQuestions.map(item => item.isCurrent = false)
      //Activate current item
      item.isCurrent = true;
    },
    changeQuestion() {
      //this.dataset: null,
      this.datasetItem = null;
      this.currentQuestionLabel = null;
      this.labelType = '';
      this.labelQuestions = null;
      this.userTargetDefinition = null;
      this.timer = null;
      this.localAnswersCount = 0;

      this.$nextTick(async ()=> {
        await this.getUserTarget(this.$route.params.id);
        //await this.getcurrentQuestionLabel();
        await this.getLabelQuestions();
        await this.getDatasetItem();
      })

    }
  },
  async mounted() {
    //Call orders matters
    await this.getDataset();
    await this.getUserTarget(this.$route.params.id);
    //await this.getcurrentQuestionLabel();
    await this.getLabelQuestions();
    await this.getDatasetItem();
  },
  watch: {
    labelQuestions: {
      handler(val) {
        this.updateLocalAnswersCount();
      },
      deep: true
    }
  }
}
</script>

<style scoped>
@media (max-width: 750px) {
  .question-history {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.question-wrapper img {
  margin: 15px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  min-height: 200px;
  min-width: 200px;
  max-height: 80% !important;
  max-width: 80% !important;
}
</style>
