<template>
  <div class="container-old home" style="padding: 0">
    <!-- Section 0 Pobel Intro -->
    <div class="row-old" style="margin: 0" id="pobel-intro">
      <div class="col-12-old home-head" style="padding: 0;">
        <h1>POBEL</h1>
        <h2 class="shadow">POBEL</h2>
        <p>POD's Crowdsourcing Labeling Service</p>
        <nuxt-link to="/datasets" class="contribute-btn">
          {{$t('TEXTS.INDEXLETSCONTRIBUTE')}}
        </nuxt-link>
        <br><br><br>
        <br><br><br>
        <div id="go-bottom" class="animate__animated animate__bounce animate__infinite animate__slow" style="z-index: 2"><span>↓</span></div>
      </div>
    </div>

    <!-- Section 1 Pobel Service -->
    <v-row class=" pobel-service" id="pobel-service">
      <v-col cols="12">
        <h3>{{$t('TEXTS.INDEXPOBELSYSTEMTITLE')}}</h3>
        <p>
        <div id="pobel-logo">
        </div>
        {{$t('TEXTS.INDEXPOBELSYSTEMCONTENT')}}
        </p>
      </v-col>
    </v-row>
    <!-- Section 2 Datasets Preview -->
    <datasets></datasets>
    <!-- Section 3 Labeling & Datasets -->
    <v-row
      class="mx-0"
      style="position:relative;">
      <div style="width: 100%; height: 100%; margin: 50px auto 50px;position: absolute;" >
        <div id="back-sq-1"></div>
        <div id="back-sq-2"></div>
      </div>
      <v-col
        cols="12"
        id="labeling-datasets"
        >
        <h3>{{$t('TEXTS.INDEXLABELINGANDDATASETTITLE')}}</h3>
        <p>
          {{$t('TEXTS.INDEXLABELINGANDDATASETCONTENT')}}
        </p>

        <p>
          {{$t('TEXTS.INDEXLABELINGANDDATASET2CONTENT')}}
        </p>
      </v-col>
    </v-row>
    <!-- Section 4 Pobel Scoreboard -->
    <v-row
      v-if="isAuthenticated"

      class="mx-0">
      <users></users>
    </v-row>
    <!-- Section 5 Pobel Business Model -->
    <v-row >
      <v-col cols="12">
        <h3>{{$t('TEXTS.INDEXINCOMEGENERATIONPROCESSTITLE')}}</h3>

        <p>
          {{$t('TEXTS.INDEXINCOMEGENERATIONPROCESSCONTENT')}}
        </p>
      </v-col>
    </v-row>

    <div class="row-old" id="business-shape-wrapper">
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage1">
        <span>1</span>
        <p>{{$t('TEXTS.INDEXINCOMEGENERATIONPROCESSSTEP1')}}</p>
      </div>
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage2">
        <span>2</span>
        <p>{{$t('TEXTS.INDEXINCOMEGENERATIONPROCESSSTEP2')}}</p>
      </div>
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage3">
        <span>3</span>
        <p>{{$t('TEXTS.INDEXINCOMEGENERATIONPROCESSSTEP3')}}</p>
      </div>
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage4">
        <span>4</span>
        <p >{{$t('TEXTS.INDEXINCOMEGENERATIONPROCESSSTEP4')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import Datasets from "../components/home/Datasets";
import Users from "../components/home/Users";
import TopBarHome from "../components/TopBarHome";

import Vivus from "vivus"
import Logo from "~/assets/images/logo.svg"

import "../plugins/fluid"


export default {
  layout: "home",
  auth: false,
  data() {
    return {
      logo: `<svg svg-inline svg-sprite src="~assets/images/logo.svg" class="logo" />`
    }
  },
  components: {
    TopBarHome,
    Users,
    Datasets,
    Logo
  },
  computed: {
    ...mapGetters({
      user: "auth/currentUser",
      isAuthenticated: "auth/isAuthenticated"
    })
  },
  methods: {
    //importFluid: () => import("../plugins/fluid"),
    animate: (elem, style, unit, from, to, time, prop) => {
      if (!elem) {
        return;
      }
      var start = new Date().getTime(),
        timer = setInterval(function () {
          var step = Math.min(1, (new Date().getTime() - start) / time);
          if (prop) {
            elem[style] = (from + step * (to - from)) + unit;
          } else {
            elem.style[style] = (from + step * (to - from)) + unit;
          }
          if (step === 1) {
            clearInterval(timer);
          }
        }, 25);
      if (prop) {
        elem[style] = from + unit;
      } else {
        elem.style[style] = from + unit;
      }
    }
  },
  mounted() {
    Fluid.initialize();

    document.querySelector('#app') && document.querySelector('#app').addEventListener('mousemove', (e) => {
      if (document.querySelector('.shadow'))
        document.querySelector('.shadow').style.transform = `translate(${e.clientX * 0.1}px, ${e.clientY * 0.07}px)`;
    });

    window.onscroll = function () {
      let scrollFromTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);

      if (document.querySelector('#go-bottom')) {
        if (scrollFromTop == 0) {
          document.querySelector('#go-bottom').style.display = 'block';
        } else if (scrollFromTop > 0) {
          document.querySelector('#go-bottom').style.display = 'none';
        }
      }
    };

    document.querySelector('#go-bottom') && document.querySelector('#go-bottom').addEventListener('click', () => {
      var target = document.getElementById("pobel-service");
      this.animate(document.scrollingElement || document.documentElement, "scrollTop", "", 0, target.offsetTop + 90, 500, true);
    });

    document.querySelector('#labeling-datasets') && document.querySelector('#app').addEventListener('mousemove', (e) => {
      let backSq1 = document.querySelector('#back-sq-1');
      let backSq2 = document.querySelector('#back-sq-2');
      if (backSq1) backSq1.style.transform = `translate(${e.clientX * -0.02}px, ${e.clientY * -0.02}px)`;
      if (backSq2) backSq2.style.transform = `translate(${e.clientX * 0.04}px, ${e.clientY * 0.02}px)`;
    });

    if (document.querySelector('#pobel-logo')) {
      this.$nextTick(()=>{
        new Vivus('pobel-logo', {duration: 200, file: Logo}, () => { //'../../assets/images/logo.svg'
          if (document.querySelector('#pobel-logo'))
            document.querySelector('#pobel-logo').style.transform = 'rotate(-15deg)';
        })
      });
    }
  }
}
</script>

<style lang="scss" >
@import '~vuetify/src/styles/settings/_variables.scss';

.home {
  p{
    margin-bottom: 0;
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  #pobel-intro  {
    h1 {
      font-size: 100px !important;
    }
    h2.shadow {
      font-size: 200px !important;
      left: -100px !important;
      top: 0 !important;
    }
    p{
      font-size: 30px !important;
      line-height: 1.3;
    }
  }

  .home {
    h3 {
      font-size: 16px;
      padding: 20px 0;
    }

    p {
      font-size: .8em !important;
    }

    #labeling-datasets {
      padding: 5px 20px 20px;
      p{
        text-align: justify;
      }
    }

    #business-shape-wrapper {
      margin: 10px auto;

      p{
        text-align: justify;
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'xs-only')} {
  #pobel-intro  {
    h1 {
      font-size: 70px !important;
    }
    h2.shadow {
      font-size: 150px !important;
      left: -100px !important;
      top: 0 !important;
    }
    p{
      font-size: 30px !important;
      line-height: 1.3;
      text-align: left;
    }
  }
}

@media (max-width: 800px) {
  #pobel-logo {
    max-width: 70% !important;
    float: none  !important;;
    margin: 50px auto  !important;;
  }
}
</style>
