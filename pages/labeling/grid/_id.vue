<template>
    <div class="container-old">
      <datasets-nav
        v-if="dataset && userTargetDefinition"

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
      <v-row
        v-else

        class=" main mt-0">
        <v-col cols="12" class=" grid-images-wrapper pt-0">
          <p class="question-text static">
            {{$t('TEXTS.LABELINGQUESTIONPART1')}}
            <strong

              @click='() => { window.open(`https://www.google.com/search?tbm=isch&q="${labelQuestions[0].ItemJob}" ${labelQuestions[0].ItemName}`); }'

              style="cursor: pointer;">
<!--              {{randomLabel.name.replace(/[0-9]/g, '').replace(/_/g, ' ') }}-->
              {{labelQuestions[0].ItemName}}
               ({{ labelQuestions[0].ItemJob }})
            </strong>
            {{$t('TEXTS.LABELINGQUESTIONPART2')}}
          </p>
          <ol
            v-if="!$vuetify.breakpoint.xs"

            class="grid-images-list" >
            <li
              v-for="item of labelQuestions"

              id="q-0"
              class="grid-images-list-items"
              :class="{
                'completed yes': item.answer !== -1 && item.isYes,
                'completed no': item.answer !== -1 && item.isNo,
                'completed report': item.isReport,
                'g': item.g,

              }"
              :style="{backgroundImage: `url(${$axios.defaults.baseURL}/api/File/Dataset/Item/${item.DatasetItemId})`}">
              <div

                class="grid-images-overlay-bg">
                <div
                  @click="setItemAnswerTo(item, 'yes')"

                  :data-title="$t('GENERAL.ISCORRECT')"
                  class="grid-images-overlay-icons grid-images-overlay-yes"></div>
                <div
                  @click="setItemAnswerTo(item, 'no')"

                  :data-title="$t('GENERAL.ISINCORRECT')"
                  class="grid-images-overlay-icons grid-images-overlay-no"></div>
                <div
                  @click="setItemAnswerTo(item, 'report')"
                  data-id="0"

                  :data-title="$t('GENERAL.REPORT')"
                  class="grid-images-overlay-icons grid-images-overlay-report"></div>
              </div>
            </li>
          </ol>

          <div v-else
               style="position:relative;width: 100%; display: block"
          >
            <v-carousel
              vertical hide-delimiter-background light hide-delimiters

              v-model="carouselModel"

              :cycle="false"

              ref='carousel'
              height="315px"
              style="overflow: hidden"
              vertical-delimiters="i">
              <v-carousel-item
                :key="index"
                v-for="(item, index) of labelQuestions">

                <v-sheet
                  color="transparent"
                  height="100%"
                  tile
                >
                  <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                  >
                    <div
                      :class="{
                        'completed yes': item.answer !== -1 && item.isYes,
                        'completed no': item.answer !== -1 && item.isNo,
                        'completed report': item.isReport,
                     }"

                      class="display-3 ">
                      <img
                        class=""
                        height="150px"
                        width="150px"
                        style="margin: 20px auto 0;display: flex;"
                        :src="`${$axios.defaults.baseURL}/api/File/Dataset/Item/${item.datasetItemId}`">
<!--
        https://static2.khoondanionline.com/thumbnail/KGuPcGgDttnK/9-wZKh4hicXyJvwVQ1c9MgnJ79Dd3XqXIM1JsiCe47NYS6jramGkBPdo-QVEe9EuUKNBJTAl-ko,/%D8%B9%D9%84%DB%8C+%D8%A7%D9%86%D8%B5%D8%A7%D8%B1%DB%8C%D8%A7%D9%86.jpg
        -->
                      <v-layout
                        column

                        class="question-history">
                        <v-btn
                          outlined

                          :class="{
                            'completed yes': item.answer !== -1 && item.isYes,
                          }"
                          @click="()=> {$refs.carousel.next(); setItemAnswerTo(item, 'yes')}"

                          color="#444"
                          class="mb-1">{{$t('GENERAL.YES')}}</v-btn>
                        <v-btn
                          outlined

                          :class="{
                            'completed no': item.answer !== -1 && item.isNo,
                          }"
                          @click="()=> {$refs.carousel.next(); setItemAnswerTo(item, 'no')}"

                          color="#444"
                          class="mb-1">{{$t('GENERAL.NO')}}</v-btn>
                        <v-btn
                          outlined

                          :class="{
                            'completed report': item.isReport,
                          }"
                          @click="()=> {$refs.carousel.next(); setItemAnswerTo(item, 'report')}"

                          color="#444">{{$t('GENERAL.REPORT')}}</v-btn>
                      </v-layout>
                    </div>
                  </v-row>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
            <div class="items-status question-history">
              <div
                v-for="(item, index) of labelQuestions"

                :class="{
                  'active': carouselModel === index,
                  'default': !item.isYes && !item.isNo && !item.isReport,
                  'completed yes': item.answer !== -1 && item.isYes,
                  'completed no': item.answer !== -1 && item.isNo,
                  'completed report': item.isReport,
              }"
                @click="()=> carouselModel = index"
              style="position:relative;">
              </div>
            </div>
          </div>

        </v-col>
      </v-row>
      <v-row class=" footer grid-footer mt-0 py-2" style="">
        <button
          v-if="!localAnswersCount && !localReportsCount"

          @click="changeQuestion"

          class="answer my-0">{{ $t('GENERAL.GOTONEXTLIST') }}</button>

        <button
          v-else

        @click="submitAnswers"
          class="my-0 ">{{ $t('GENERAL.SUBMITANSWERS') }}</button>
      </v-row>
    </div>
</template>

<script>
import DatasetsNav from "~/components/navbars/DatasetsNav";
import { mapGetters } from "vuex"

import Modal from "../../../plugins/external/Modal/index"

export default {
  name: "labeling_grid_id",
  layout: 'labeling',
  components: {DatasetsNav},
  middleware: "authRequired",
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
      localAnswersCount: 0,
      localReportsCount: 0,
      carouselModel: 0,
      currentQuestionId: null
    }
  },
  methods: {
    async getDataset() {
      // const data = {
      //   id: this.$route.params.id,
      // }
      try {
        const result = await this.$apiService.get('/api/Datasets/Get/' + this.$route.params.id);

        if (result.data && result.data.result) {
          this.dataset = result.data.result
        }
      } catch (error) {
        console.log(error)
      }
    },
    // async getRandomLabel() {
    //   const data = {
    //     datasetId: this.$route.params.id,
    //     count: 1
    //   }
    //
    //   //TODO: create new target ?
    //   try {
    //     const result = await this.$apiService.get('/api/Questions/GetRandomLabel', data);
    //     if (result.data && result.data) {
    //       this.randomLabel = result.data[0]
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    async getLabelQuestions() {
      // if (!this.randomLabel)
      //   return;

      let data = {
        DatasetId: this.$route.params.id,
        Count: 9,
        OnlyOneLabel: true
        //LabelId: this.randomLabel.id,
      }

      try {
        const result = await this.$apiService.get('/api/Questions/GetQuestions', data);

        if (result.data) {
          this.labelQuestions = result.data;
          this.labelQuestions.forEach(item => {
            this.$set(item, "isYes", false);
            this.$set(item, "isNo", false);
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
        console.log(error.data, error )
      }
    },
    async getUserTarget(datasetId) {
      let data = {
        DatasetId: datasetId,
        UserId: this.user.Id
      }

      try {
        const target = await this.$apiService.get('/api/Targets/GetCurrentTarget', data);
        if(target.data) {

          //let targetDefinition = await this.$apiService.get('/api/TargetDefinitions/Get/' + targets.data.result.items[0].targetDefinitionId, data);
          this.userTargetDefinition = target.data.TargetDefinition;//targetDefinition.data.result;
          this.$set(this.userTargetDefinition, 'currentUserAnswersCount', 0);

          await this.getUserAnswersCount();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getUserAnswersCount() {
      let data = {
        DatasetId: this.$route.params.id,
        UserId: this.user.id
      }

      try {
        const answerStat = await this.$apiService.get('/api/Answers/Stats', data);
        if(answerStat.data && answerStat.data.result ) {
          console.log()
          this.userTargetDefinition.currentUserAnswersCount = answerStat.data.result.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // async getDatasetItem() {
    //   if(!this.labelQuestions)
    //     return
    //   // let data = {
    //   //   id: this.labelQuestions[0].datasetItemId,
    //   // }
    //
    //   try {
    //     const result = await this.$apiService.get('/api/DatasetItems/Get/' + this.labelQuestions[0].DatasetItemId);
    //     if (result.data) {
    //       this.datasetItem = result.data;
    //
    //       //TODO: WTF ?
    //       let fieldName = this.datasetItem.FilePath;
    //       fieldName = fieldName.split('\\')[4];
    //       switch (fieldName) {
    //         case 'Actors':
    //           this.labelType = this.$t('GENERAL.ACTOR');
    //           break;
    //
    //         case 'Singers':
    //           this.labelType = this.$t('GENERAL.SINGER');
    //           break;
    //
    //         case 'Politicians':
    //           this.labelType = this.$t('GENERAL.POLITICIAN');
    //           break;
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    async submitAnswersToServer() {
      let isAnswersSubmited = false, answers = [], finalAnswers = [];
      answers = this.labelQuestions.filter(item => item.answer !== -1);
      //TODO: make sure user can not reach here without answers
      if(answers.length) {
        finalAnswers = answers.map(item => {

          //TODO: improve it for questions with more than yes and no answer options
          return {
            DatasetId: item.Options[0].DatasetId,
            DatasetItemId: item.DatasetItemId,
            AnswerIndex: item.answer,
            DurationToAnswerInSeconds: Math.round(this.timer/this.labelQuestions.length),
            Ignored: false,
          }
        });
        let data = {
          Answers: finalAnswers,
          QuestionId: answers[0].QuestionId
        }

        try{
          const submitionResult = await this.$apiService.post("api/Answers/SubmitBatchAnswer", data)
          isAnswersSubmited = true;
        } catch (error) {
          console.log(error)
        }
      }
    },
    async submitAnswers() {
      let continueModal = Modal({
        title: this.$t('GENERAL.SUBMITANSWERSANDCONTINUE'),//'ارسال پاسخ (ها) و ادامه',
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


      //let reports = [];
/*      answers = this.labelQuestions.filter(item => item.answer === true);
      //TODO: make sure user can not reach here without answers
      if(answers.length) {
        let data = {
          answers: answers
        }

        try{
          const submitionResult = await this.$apiService.post("/api/Answers/SubmitBatchAnswer", data)
          window.location.reload();
        } catch (error) {
          console.log(error)
        }
      }*/
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
    setItemAnswerTo(item, state) {
      switch (state) {
          case 'yes':
            if(!item.isYes) {
              item.isNo = false;
              item.isReport = false;
              item.isYes = true;
              item.answer = 1;
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
              item.answer = 0;
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
    },
    changeQuestion() {
      //this.dataset: null,
      this.datasetItem = null;
      this.randomLabel = null;
      this.labelType = '';
      this.labelQuestions = null;
      this.userTargetDefinition = null;
      this.timer = null;
      this.localAnswersCount = 0;

      this.$nextTick(async ()=> {
        await this.getUserTarget(this.$route.params.id);
        //await this.getRandomLabel();
        await this.getLabelQuestions();
       // await this.getDatasetItem();
      })

    }
  },
  async mounted() {
    //Call orders matters
    await this.getDataset();
    await this.getUserTarget(this.$route.params.id);
    //await this.getRandomLabel();
    await this.getLabelQuestions();
    //await this.getDatasetItem();
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
ol {
  padding: 0 !important;
}

@media #{map-get($display-breakpoints, 'xs-only')} {
  .grid-images-list {
    transform: scale(.7);
  }

  p {
    font-size: .8em !important;
  }

  .dataset-name:before {
    top: 12px;
  }

  .footer {
    margin-top: 0;
  }
}

.question-history .completed.yes:after {
  content: '✓';
  position: absolute;
  top: -12px;
  right: 5px;
  color: #1d7e00;
}

.question-history .completed.no:after {
  content: '⤫';
  position: absolute;
  top: -12px;
  right: 5px;
  color: #a4001d;
}

.question-history .completed.skip:after {
  content: '?';
  position: absolute;
  top: -12px;
  right: 5px;
  color: #ffd217;
}

.question-history .completed.report:after {
  content: '⚐';
  position: absolute;
  top: -12px;
  right: 5px;
  color: #6e2e45;
}

.items-status {
  position: absolute;
  top: 0;
  right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 9999;

  div{
    width: 20px;
    height: 20px;
    margin-bottom: 5px;
    cursor: pointer;


    &.default {
      background-color: #e6e4e4;
      border-radius: 50%;

      &:after {
        content: " ";
        background-color: #cecece;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        display: block;
        top: 5px !important;
        right: 5px;
      }

      &.active {
        width: 25px;
        height: 25px;

        &:after {
          width: 13px;
          height: 13px;
          top: 6px !important;
          right: 6px;
        }
      }
    }

    &:after {
      position: relative !important;
      top: unset !important;
    }
  }

}

</style>
