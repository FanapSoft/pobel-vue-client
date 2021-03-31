<template>
  <v-row class="header mb-auto">
    <v-col cols="6"  class=" dataset-name d-flex align-center" style="position: relative">
      <h4>
        {{ dataset.name }}
        <small>{{ dataset.description }}</small>
      </h4>
    </v-col>
    <v-col cols="6" class=" back-btn-wrapper">
      <v-btn
        dark fab depressed x-small

        @click="showHelpModal"

        class="" :class="{'ml-3': $isRTL, 'mr-3 ml-0': !$isRTL}">
        <v-icon>mdi-help</v-icon>
      </v-btn>
      <div class="stats-wrapper">
        <p class="timer" style="margin-bottom: 0">
          <label id="hours">{{ timer.hours || '00' }}</label><span>:</span><label id="minutes">{{ timer.minutes || '00' }}</label><span>:</span><label id="seconds">{{ timer.seconds || '00' }}</label>
        </p>
        <p class="target-counter" style="margin-bottom: 0">
          <label
            id="targetCount"
            data-title="هدف تعیین شده برای این مجموعه داده"
            :data-value="target.answerCount">{{ target.answerCount }}</label><span>/</span><label
            id="answersCount"
            data-title="تعداد پاسخ های شما تا این لحظه"
            data-value="284">{{ target.currentUserAnswersCount + localAnswersCount }}</label>
        </p>
      </div>
      <button
        @click="()=> $router.push(`/dataset/${dataset.id}`)"
        class="back-btn">{{ $isRTL ? '🡠' : '🡢'}}</button>
    </v-col>
  </v-row>
</template>

<script>
import {mapState, mapGetters} from "vuex"
import Modal from "~/plugins/external/Modal";

export default {
  name: "DatasetsNav",
  props: {
    dataset: null,
    target: null,
    localAnswersCount: 0
  },
  data() {
    return {
      timer: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      timerOptions: {
        totalSeconds: 0,

      },
      globalInterval: null
    }
  },
  computed: {
    ...mapGetters({
      user: "auth/currentUser",
      isAuthenticated: "auth/isAuthenticated"
    }),
  },
  methods: {
    setTime() {
      ++this.timerOptions.totalSeconds;
      this.timer.seconds = this.pad(this.timerOptions.totalSeconds % 60);
      this.timer.minutes = this.pad((parseInt(this.timerOptions.totalSeconds / 60) % 60));
      this.timer.hours = this.pad(parseInt(this.timerOptions.totalSeconds / 3600));
      this.$emit("totalSeconds", this.timerOptions.totalSeconds);
    },
    pad(val) {
      let valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    },

    showHelpModal(){
      let continueModal = Modal({
        title: 'راهنما',
        body: `در مجموعه داده فعلی برای برچسب زنی شما گزینه های زیر را دارید:
        <br />
        <span class="help-icon " >✓</span>
         درست است (تصویر مطابقت دارد)
        <br />
        <span class="help-icon" >⤫</span>
        درست نیست (تصویر مطابقت ندارد)
        <br />
        <span class="help-icon " >⚐</span>
        تصویر ایراد دارد
         (گزارش ایراد در تصویر؛ ناخوانا، تار بودن، لود نشدن و غیره...)
        <br />
        نکته1: در حال حاضر گزارش تصاویر دارای ایراد، فاقد امتیاز می باشد.
        <br />
        نکته2: برخی آیتم ها طلایی هستند، بدین معنی که ما پاسخ آنها را میدانیم. در صورت پاسخ صحیح به سوالات طلایی امتیاز میگیرید، در صورت پاسخ غلط به آنها از امتیاز شما کسر می گردد و در صورت عدم پاسخ به آنها امتیازی نمیگیرید.
        <br>
        در صورتیکه مردد هستید و جهت جلوگیری از کاهش امتیاز خود هیچ پاسخی را بر روی تصویر مربوطه درج نکنید و از پاسخ دادن صرفنظر نمایید.
`,
        fullscreen: true,
        actions: [
          {
            title: 'متوجه شدم',
            class: ['active'],
            fn: async () => {
              continueModal.close();
            },

          },
        ],
        closeBtnAction: () => {
          continueModal.close();
        }
      });
    }
  },
  mounted() {
    this.globalInterval = setInterval(this.setTime, 1000);
  },
}
</script>

<style lang="scss" scoped>
@media #{map-get($display-breakpoints, 'xs-only')} {
  .header {
    h4 {
      font-size: 12px;
      small {
        font-size: 10px;
      }
    }

    .timer, .target-counter {
      padding: 0 !important;
      min-width: 65px;
    }

    .timer label, .timer span {
      font-size: 12px !important;
    }

    #targetCount {
      font-size: 12px;
    }

    .target-counter label, .target-counter span {
      font-size: 16px;
    }

    .dataset-name:before {
      right: -3px;
      top: 15px;
    }
  }

  .back-btn {
    font-size: 18px;
    min-width: 40px;
    height: 40px;
    line-height: 42px;
  }
}
</style>
<style>
.help-icon {
  color: #ffe58a;
  font-size: 19px;
  /*border: solid 1px #ffe58a;*/
  border-radius: 50%;
  background-color: #000000;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 1.7;
  vertical-align: middle;
  margin: 8px 0 8px 8px;
}
</style>
