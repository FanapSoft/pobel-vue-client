<template>
  <v-container >
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
      <div
        v-if="currentActiveItemIndex > -1"

        class="col-9-old">
        <div

          class="question-wrapper">
          <p class="question-text static">
            {{$t('TEXTS.LABELINGSENTIMENTQUESTIONPART1')}}

            <span style="font-size: 12px; color: rgb(187, 187, 187);"> (
              {{labelQuestions[currentActiveItemIndex].field}}
              -
              {{labelQuestions[currentActiveItemIndex].source}}
              )</span>
          </p>
          <p class="question-sentence">{{ labelQuestions[currentActiveItemIndex].text }}</p>
        </div>
        <div

          class="answer-wrapper">
          <div class="yes-no-type emoji-container">
            <button
              @click="setItemAnswerTo('yes')"

              id="yesBtn"
              data-id="4">😄<br>
              <p>{{ $t('GENERAL.GOOD')}}</p></button>
            <button
              @click="setItemAnswerTo('skip')"

              id="skipBtn"
              data-id="0">🙄<br>
              <p>{{ $t('GENERAL.NOTHING')}}</p></button>
            <button
              @click="setItemAnswerTo('no')"

              id="noBtn"
              data-id="4">😡<br>
              <p>{{ $t('GENERAL.BAD')}}</p></button>
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

            class="question-list-items question-list-items-sentence">
            <p

              class="question-history-sentence" style="margin-bottom: 0">
              {{ item.text }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="row footer">
      <button
        v-if="!localAnswersCount && !localReportsCount"

        @click="changeQuestion"

        class="answer">{{ $t('GENERAL.GOTONEXTLIST') }}
      </button>
      <button
        v-else

        @click="submitAnswers">{{ $t('GENERAL.SUBMITANSWERS') }}
      </button>

      <button
        @click="setItemAnswerTo('report')">
        {{ $t('GENERAL.REPORT') }}
        <svg width="24" height="24" viewBox="0 0 24 24">
          <defs>
            <path id="flag-a"
                  d="M20.4 2.1c-.4-.2-.8-.1-1.1.2 0 0-.9.7-3.3.7-1.3 0-2.4-.5-3.6-.9C11.1 1.5 9.7 1 8 1 4.8 1 3.5 2.1 3.3 2.3c-.2.2-.3.4-.3.7v19c0 .6.4 1 1 1s1-.4 1-1v-6.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9 1.3.5 2.7 1.1 4.4 1.1 3.2 0 4.5-1.1 4.7-1.3.2-.2.3-.4.3-.7V3c0-.4-.2-.7-.6-.9zM19 14.5c-.4.2-1.4.5-3 .5-1.3 0-2.4-.5-3.6-.9C11.1 13.5 9.7 13 8 13c-1.3 0-2.3.2-3 .4V3.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9C12.9 4.5 14.3 5 16 5c1.3 0 2.3-.2 3-.4v9.9z"></path>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <mask id="flag-b" fill="#fff">
              <use xlink:href="#flag-a"></use>
            </mask>
            <use fill="#000" fill-rule="nonzero" xlink:href="#flag-a"></use>
            <g fill="#4A4A4A" mask="url(#flag-b)">
              <path d="M0 0h24v24H0z"></path>
            </g>
          </g>
        </svg>
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
  computed: {
    ...mapGetters({
      user: "auth/currentUser"
    }),
    currentActiveItem() {
      if (!this.labelQuestions)
        return 0;
      return this.labelQuestions.filter(item => item.isCurrent === true)[0]
    },
    currentActiveItemIndex() {
      let index = 0
      if (!this.labelQuestions)
        return index;

      return this.labelQuestions.findIndex(item => item.isCurrent === true)
    },
  },
  data() {
    return {
      dataset: {
        id: '11111',
        name: 'دیتاست سنتیمنت',
        description: 'جملات نیازمند برچسب زده شدن',
      },
      datasetItem: null,
      labelType: '',
      labelQuestions: [
        {
          "id": 0,
          "text": "از نظر کیفی عالی",
          "field": "خرده فروشی",
          "source": "دیجی کالا",
        },

        {
          "id": 1,
          "text": "يک اشکال بزرگ اين گوشي اينه که دوربينش زوم نداره!",
          "field": "خرده فروشی",
          "source": "دیجی کالا"
        },
        {
          "id": 2,
          "text": "چیز برگر شیلا رو واقعا دوست میدارم",
          "field": "سفارش غذا",
          "source": "اسنپ فود"
        },
        {
          "id": 3,
          "text": "طرحش خیلی قشنگه و بعد چسبوندن خیلی قشنگ میشه",
          "field": "خرده فروشی",
          "source": "دیجی کالا"
        },
        {
          "id": 4,
          "text": "پولتون رو دور میریزید \nوقتی رمش ۱ باشه حافظه اش ۸ باشه \nحتی 4G نیست\"",
          "field": "خرده فروشی",
          "source": "دیجی کالا"
        },
        {
          "id": 5,
          "text": "من تو پیشنهاد ویژه خریدم که به نظرم ارزش این قیمت را هم ندارد ....سایز اون خیلی کوچک هست در حد بچه های ابتدایی.....کیفیت دوختش هم خوب نیست.....من برای همسرم سفارش دادم ولی چون کوچک بود مجبورم خودم استفاده کنم",
          "field": "خرده فروشی",
          "source": "دیجی کالا"
        },
        {
          "id": 6,
          "text": "عالیه❤❤❤",
          "field": "خرده فروشی",
          "source": "دیجی کالا"
        },
      ],
      userTargetDefinition: {
        currentUserAnswersCount: 100,
        answerCount: 50
      },
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
            if (!index)
              this.$set(item, "isCurrent", true);
            else
              this.$set(item, "isCurrent", false);

            this.$set(item, "isYes", false);
            this.$set(item, "isNo", false);
            this.$set(item, "isSkip", false);
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
        if (targets.data && targets.data.result && targets.data.result.items && targets.data.result.items.length) {
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
        if (answerStat.data && answerStat.data.result) {
          console.log()
          this.userTargetDefinition.currentUserAnswersCount = answerStat.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getDatasetItem() {
      if (!this.labelQuestions)
        return
      let data = {
        id: this.labelQuestions[0].datasetItemId,
      }

      try {
        const result = await this.$apiService.get('/api/services/app/DatasetItems/Get', data);
        if (result.data && result.data.result) {
          this.datasetItem = result.data.result;
        }
      } catch (error) {
        console.log(error)
      }
    },
    async submitAnswersToServer() {
      let isAnswersSubmitted = false, answers = [], finalAnswers = [];
      answers = this.labelQuestions.filter(item => item.answer !== -1);
      //TODO: make sure user can not reach here without answers
      if (answers.length) {
        finalAnswers = answers.map(item => {
          //TODO: improve it for questions with more than yes and no answer options
          return {
            dataSetId: (item.answer === 0 ? item.options[0].dataSetId : item.options[1].dataSetId),
            dataSetItemId: item.datasetItemId,
            answerIndex: (item.answer === 0 ? item.options[0].index : item.options[1].index),
            durationToAnswerInSeconds: Math.round(this.timer / this.labelQuestions.length)
          }
        });
        let data = {
          answers: finalAnswers
        }

        try {
          const submitionResult = await this.$apiService.post("api/services/app/Answers/SubmitBatchAnswer", data)
          isAnswersSubmitted = true;
        } catch (error) {
          console.log(error)
        }
      }
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
      if (this.labelQuestions) {
        for (let i of this.labelQuestions) {
          if (i.answer !== -1 && (i.isYes || i.isNo)) {
            this.localAnswersCount++
          } else if (i.answer === -1 && i.isReport) {
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
    activateNextItem() {
      let currentIndex = this.currentActiveItemIndex;

      if (currentIndex < this.labelQuestions.length - 1)
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
      this.labelType = '';
      this.labelQuestions = null;
      this.userTargetDefinition = null;
      this.timer = null;
      this.localAnswersCount = 0;


    }
  },
  async mounted() {
    //Call orders matters

    //Fake data for now
    this.labelQuestions.forEach((item, index) => {
      if (!index)
        this.$set(item, "isCurrent", true);
      else
        this.$set(item, "isCurrent", false);

      this.$set(item, "isYes", false);
      this.$set(item, "isNo", false);
      this.$set(item, "isSkip", false);
      this.$set(item, "isReport", false);
      this.$set(item, "answer", -1);
    })
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
@media (max-width: 500px) {
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
