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

          class="I-PoN">
          <p class="question-text static">
            آیا تصویر زیر متعلق به
            <strong

              @click='() => { window.open(`https://www.google.com/search?tbm=isch&q="${labelType}" ${labelQuestions[currentActiveItemIndex].title.replace(/[0-9]/g, "").replace(/_/g, " ")}`); }'

              style="cursor: pointer;">
              {{ labelQuestions[currentActiveItemIndex].title.replace(/[0-9]/g, '').replace(/_/g, ' ') }}

              ({{ labelType }})
            </strong>
            است؟
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

        class="answer">برو به لیست بعدی</button>
      <button
        v-else

        @click="submitAnswers">ارسال پاسخ ها</button>

      <button>
        گزارش
        <svg width="24" height="24" viewBox="0 0 24 24"><defs><path id="flag-a" d="M20.4 2.1c-.4-.2-.8-.1-1.1.2 0 0-.9.7-3.3.7-1.3 0-2.4-.5-3.6-.9C11.1 1.5 9.7 1 8 1 4.8 1 3.5 2.1 3.3 2.3c-.2.2-.3.4-.3.7v19c0 .6.4 1 1 1s1-.4 1-1v-6.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9 1.3.5 2.7 1.1 4.4 1.1 3.2 0 4.5-1.1 4.7-1.3.2-.2.3-.4.3-.7V3c0-.4-.2-.7-.6-.9zM19 14.5c-.4.2-1.4.5-3 .5-1.3 0-2.4-.5-3.6-.9C11.1 13.5 9.7 13 8 13c-1.3 0-2.3.2-3 .4V3.5c.4-.2 1.4-.5 3-.5 1.3 0 2.4.5 3.6.9C12.9 4.5 14.3 5 16 5c1.3 0 2.3-.2 3-.4v9.9z"></path></defs><g fill="none" fill-rule="evenodd"><mask id="flag-b" fill="#fff"><use xlink:href="#flag-a"></use></mask><use fill="#000" fill-rule="nonzero" xlink:href="#flag-a"></use><g fill="#4A4A4A" mask="url(#flag-b)"><path d="M0 0h24v24H0z"></path></g></g></svg>
      </button>
    </div>
  </div>
</template>

<script>
import DatasetsNav from "../../../components/navbars/DatasetsNav";
import { mapGetters } from "vuex";

export default {
  name: "_id",
  components: {DatasetsNav},
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
}
</script>

<style scoped>

</style>
