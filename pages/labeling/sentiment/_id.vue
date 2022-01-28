<template>
  <v-container >
    <div
      v-if="!dataset || !userTargetDefinition"

      style="display: flex; align-items: center; justify-content: center;">
      <loader />
    </div>
    <datasets-nav
      v-else

      :dataset="dataset"
      :target="userTargetDefinition"
      :localAnswersCount="localAnswersCount"
      @totalSeconds="tm => timer = tm"

      items-type="feeling"></datasets-nav>

    <div
      v-if="!labelQuestions"

      style="display: flex; align-items: center; justify-content: center;margin-top: 20px">
      <loader />
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
              {{labelQuestions[currentActiveItemIndex].Field}}
              -
              {{labelQuestions[currentActiveItemIndex].Source}}
              )</span>
          </p>
          <p class="question-sentence">{{ labelQuestions[currentActiveItemIndex].Content.replaceAll('_x000D_', ' ') }}</p>
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
                'completed yes': item.answer === 1 && item.isYes,
                'completed no': item.answer === -1 && item.isNo,
                'completed skip':  item.answer == 0 && item.isSkip,
                'completed report': item.isReport,
                'active': item.isCurrent,
                'g': item.G,
                'gYes': item.CorrectGoldenAnswerIndex === 1,
                'gNo': item.CorrectGoldenAnswerIndex === 0,
                'gSkip': item.CorrectGoldenAnswerIndex === -1,
              }"
            @click="activateCurrentQuestion(item)"

            class="question-list-items question-list-items-sentence">
            <p

              class="question-history-sentence" style="margin-bottom: 0">
              {{ item.Content.replaceAll('_x000D_', ' ') }}
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
import Loader from "@/components/general/Loader";


export default {
  name: "labeling_linear_id",
  layout: 'default',
  components: { Loader, DatasetsNav},
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
      labelQuestions: null,
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
      // const data = {
      //   id: this.$route.params.id,
      // }
      try {
        const result = await this.$apiService.get('/api/Datasets/Get/' + this.$route.params.id);

        if (result.data && result.data) {
          this.dataset = result.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getQuestions() {
      let data = {
        DatasetId: this.$route.params.id,
        Count: 7,
        OnlyOneLabel: false
        //LabelId: this.currentQuestionLabel.id,
      };

      try {
        const result = await this.$apiService.get('/api/Questions/GetQuestions', data);
        if (result.status < 400) {
          this.labelQuestions = result.data;
          this.labelQuestions.forEach((item, index) => {
            if (!index)
              this.$set(item, "isCurrent", true);
            else
              this.$set(item, "isCurrent", false);

            this.$set(item, "isYes", false);
            this.$set(item, "isNo", false);
            this.$set(item, "isSkip", false);
            this.$set(item, "isReport", false);
            this.$set(item, "answer", -2);
          });
        } else {
          if(result.data[0] && [3351, 3352, 3600].includes(result.data[0].code)) {
            let alertModal = Modal({
              title: this.$t('TEXTS.LABELINGERROR'),
              body: this.$t('TEXTS.DATASETITEMSDONE'),
              backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
              actions: [
                {
                  title: this.$t('GENERAL.CLOSE'),
                  class: ['noBorder'],
                  fn: () => {
                    this.$router.push("/dataset/" + this.$route.params.id);
                    alertModal.close();
                  }
                },
              ],
              closeBtnAction: () => {
                this.$router.push("/dataset/" + this.$route.params.id);
                alertModal.close();
              }
            });
          } else if(result.data[0] && [3203, 3300, 3301, 3350].includes(result.data[0].code)) {
            this.$router.push("/dataset/" + this.$route.params.id);
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getUserTarget() {
      let data = {
        DatasetId: this.$route.params.id,
        UserId: this.user.Id
      }

      try {
        const target = await this.$apiService.get('/api/Targets/GetCurrentTarget', data);
        if(target.status < 400) {
          this.userTargetDefinition = target.data.TargetDefinition;//targetDefinition.data.result;
          this.$set(this.userTargetDefinition, 'currentUserAnswersCount', 0);

          await this.getUserAnswersCount();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUserAnswersCount() {
      ///api/Answers/Stats

      let data = {
        DatasetId: this.$route.params.id,
        UserId: this.user.Id,
        OnlyNonCalculated: true
      }

      try {
        const answerStat = await this.$apiService.get('/api/Answers/Stats', data);
        if (answerStat.status < 400) {
          this.userTargetDefinition.currentUserAnswersCount = answerStat.data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async submitAnswersToServer() {
      let isAnswersSubmitted = false, answers = [], finalAnswers = [];
      answers = this.labelQuestions.filter(item => item.answer !== -2);
      console.log('im here ?:', answers)
      if (answers.length) {
        finalAnswers = answers.map(item => {
          //TODO: improve it for questions with more than yes and no answer options
          return {
            DatasetId: this.dataset.Id,//item.Options[0].DatasetId,
            DatasetItemId: item.DatasetItemId,
            AnswerIndex: item.answer,
            DurationToAnswerInSeconds: Math.round(this.timer / this.labelQuestions.length),
            Ignored: false,
          };
        });
        let data = {
          Answers: finalAnswers,
          QuestionId: answers[0].QuestionId
        }

        try {
          const submitionResult = await this.$apiService.post("api/Answers/SubmitBatchAnswer", data)
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
          if (i.answer !== -2 && (i.isYes || i.isNo || i.isSkip)) {
            this.localAnswersCount++
          } else if (i.answer === -2 && i.isReport) {
            this.localReportsCount++;
          }
        }
      }
    },
    setItemAnswerTo(state) {
      let item = this.currentActiveItem
      switch (state) {
        case 'yes':
          if(!item.isYes) {
            item.isNo = false;
            item.isSkip = false;
            item.isReport = false;
            item.isYes = true;
            item.answer = item.Options[2].Index;
          } else  {
            item.isYes = false;
            item.isNo = false;
            item.isSkip = false;
            item.isReport = false;
            item.answer = -2;
          }
          break;
        case 'no':
          if(!item.isNo) {
            item.isYes = false;
            item.isNo = true;
            item.isSkip = false;
            item.isReport = false;
            item.answer = item.Options[0].Index;
          } else  {
            item.isYes = false;
            item.isNo = false;
            item.isSkip = false;
            item.isReport = false;
            item.answer = -2;
          }
          break;
        case 'report':
          if(!item.isReport) {
            item.isYes = false;
            item.isNo = false;
            item.isSkip = false;
            item.isReport = true;
            item.answer = -2;
          } else  {
            item.isYes = false;
            item.isNo = false;
            item.isSkip = false;
            item.isReport = false;
            item.answer = -2;
          }
          break;
        case 'skip':
          if(!item.isSkip) {
            item.isYes = false;
            item.isNo = false;
            item.isReport = false;
            item.isSkip = true;
            item.answer = item.Options[1].Index;
            console.log(item.isSkip, item.answer);
          } else  {
            item.isYes = false;
            item.isNo = false;
            item.isReport = false;
            item.isSkip = false;
            item.answer = -2;
          }
          break;
      }
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

      this.$nextTick(async ()=> {
        await this.getUserTarget(this.$route.params.id);
        await this.getQuestions();
      });
    }
  },
  async mounted() {
    //Call orders matters

    //Call orders matters
    await this.getDataset();
    await this.getUserTarget();
    //await this.getcurrentQuestionLabel();
    await this.getQuestions();
    //Fake data for now
    /*this.labelQuestions.forEach((item, index) => {
      if (!index)
        this.$set(item, "isCurrent", true);
      else
        this.$set(item, "isCurrent", false);

      this.$set(item, "isYes", false);
      this.$set(item, "isNo", false);
      this.$set(item, "isSkip", false);
      this.$set(item, "isReport", false);
      this.$set(item, "answer", -1);
    })*/
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

<style lang="scss" scoped>
.question-list-items.g.gYes::before{
  color: green;
}
.question-list-items.g.gSkip::before{
  color: #ffd700;
}
.question-list-items.g.gSkip::before{
  color: red;
}

.question-wrapper {
  height: auto;
}

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
