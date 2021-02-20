<template>
  <div class="row-old header">
    <div class="col-6-sm-old dataset-name">
      <h4>
        {{ dataset.name }}
        <small>{{ dataset.description }}</small>
      </h4>
    </div>
    <div class="col-6-sm-old back-btn-wrapper">
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
        class="back-btn">🡠</button>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex"

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
    }
  },
  mounted() {
    this.globalInterval = setInterval(this.setTime, 1000);
  },
}
</script>

<style scoped>

</style>
