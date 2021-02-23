<template>
  <div class="container-old home" style="padding: 0">
    <!-- Section 0 Pobel Intro -->
    <div class="row-old" style="margin: 0" id="pobel-intro">
      <div class="col-12-old home-head" style="padding: 0;">
        <h1>POBEL</h1>
        <h2 class="shadow">POBEL</h2>
        <p>POD's Crowdsourcing Labeling Service</p>
        <a href="/datasets" class="contribute-btn">شروع مشارکت</a>
        <br><br><br>
        <br><br><br>
        <div id="go-bottom" class="animate__animated animate__bounce animate__infinite animate__slow" style="z-index: 2"><span>↓</span></div>
      </div>
    </div>

    <!-- Section 1 Pobel Service -->
    <div class="row-old pobel-service" id="pobel-service">
      <div class="col-12-old">
        <h3>سامانه پابل</h3>
        <p>
        <div id="pobel-logo">
        </div>
        در راستای شتاب بخشیدن به توسعه فناوریهای نوین، همسو شدن با آینده‌ای هوشمند و ایجاد اشتغال، پابل با این ماموریت بنیان گردید که بستری کارا برای تکمیل یکی از اجزای زمان‌بر و پر هزینه‌ی فرآیند یادگیری ماشین یعنی برچسب‌زنی داده‌ها را ایجاد نماید. تمرکز محوری این بستر بر نقش کلیدی انسان در کمک به ارتقاء سرعت، دقت و کیفیت داده‌های ورودی به الگوریتم‌های هوش مصنوعی است. انسانها در واقع همان کاربران سامانه می‌باشند که با مشارکت موثر در برچسب‌زنی داده‌ها می‌توانند کسب درآمد نمایند. با این وجود، نزدیک کردن رفتار ماشینها به ادراک انسانی، نیازمند آموزش دادن مجموعه عظیمی از داده‌ها است که برچسب زنی آن، مستلزم سپردن این وظیفه بر عهده‌ی جمع کثیری از کاربران می‌باشد که در اصطلاح به آن فعالیت جمع سپاری اطلاق می‌گردد. شما می‌توانید با ایفای نقش مفید در این حوزه ضمن کسب درآمد، در یادگیری بهتر و کارکردی‌تر الگوریتمهای هوش مصنوعی سهیم باشید. تحقق ماموریت پابل کاری نیست که ما به تنهایی بتوانیم آن را انجام دهیم و فقط و فقط از طریق مشارکت تعداد قابل توجهی از شما کاربران گرامی قابل تحقق است.
        </p>
      </div>
    </div>

    <!-- Section 2 Datasets Preview -->

    <datasets></datasets>

    <!-- Section 3 Labeling & Datasets -->
    <div class="row-old">
      <div style="width: 100%; height: 100%; margin: 50px auto 50px;position: absolute;" >
        <div id="back-sq-1"></div>
        <div id="back-sq-2"></div>
      </div>
      <div class="col-12-old" id="labeling-datasets">

        <h3>برچسب گذاری و مجموعه داده</h3>
        <p>
          سیستمها برای شناسایی و درک احساس، تصاویر و صوت نیازمند دریافت تعداد قابل‌توجهی از مصادیق هر یک از این مفاهیم بوده تا با بهره‌گیری از طریق مدلهای هوش مصنوعی، بصورت خودکار یادگیری در تشخیص را کسب نمایند. این یادگیری در صورتی مطلوب خواهد بود که مصادیق مربوطه و یا به اصطلاح داده‌های ورودی به ماشینها از کیفیت و صحت بالایی برخوردار باشند. در این راستا، برچسب گذاری به فرآیند نشانه گذاری داده ها اطلاق می‌گردد که در آن، صحت داده‌های ورودی به ماشینها، توسط هوش انسانی ارزیابی و سپس داده‌های با کیفیت بعنوان ورودی جهت یادگیری ماشینها استفاده می‌شوند. اگر چه هدف برچسب زنی صحت سنجی مصادیق عنوان شده است، اما چگونگی انجام آن بر حسب نوع مجموعه داده (نظیر تصویری، متنی، صوتی و گفتاری) متفاوت می‌باشد.
        </p>

        <p>
          بعنوان نمونه در مجموعه داده‌ از نوع تصویری، منظور از هر برچسب این است که مشخص شود آیا تصویر نمایش داده شده متعلق به فرد مشهور خاصی مثلاً "دکتر محمد قریب" می‌باشد یا خیر؟ پاسخ به این سوال یک برچسب برای تصویر مورد نظر می‌باشد. همچنین برای برچسب زنی یک مجموعه داده برای تحلیل احساسات، کاربر پس از مطالعه یک متن کوتاه نظیر "این فیلم برای همه سنین مناسب است"، می‌بایست استنباط مثبت یا منفی خود را از موضوع مورد بحث مشخص سازد.
        </p>
      </div>
    </div>

    <!-- Section 4 Pobel Scoreboard -->
<!--    {{#isLoggedIn}}-->
    <div v-if="isAuthenticated" class="row-old">
      <users></users>
    </div>
<!--    {{/isLoggedIn}}-->

    <!-- Section 5 Pobel Business Model -->
    <div class="row-old">
      <div class="col-12-old">
        <h3>فرآیند کسب درآمد در پابل</h3>

        <p>
          فرآیند مشارکت و کسب درآمد در پابل بدین ترتیب می‌باشد که کاربران می‌توانند بطور رایگان در این سامانه ثبت نام نمایند و به مجموعه داده‌های بارگذاری شده توسط راهبر سیستم دسترسی پیدا کنند. در هریک از این مجموعه داده‌ها سوالات متعددی از نوع متنی، تصویری و صوتی وجود دارد، که کاربران، می‌بایست نسبت به برچسب زدن آن‌ها اقدام نمایند. متناسب با کمیت و کیفیت برچسب‌های ثبت شده که توسط رویکردها کنترلی بخصوصی بررسی می‌گردند، کیف پول کاربران به صورت برخط شارژ خواهد شد.
        </p>
      </div>
    </div>

    <div class="row-old" id="business-shape-wrapper">
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage1">
        <span>1</span>
        <p>ثبت نام در سامانه</p>
      </div>
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage2">
        <span>2</span>
        <p>انتخاب مجموعه داده مورد نظر</p>
      </div>
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage3">
        <span>3</span>
        <p>برچسب زنی به تعداد هدف تعیین شده</p>
      </div>
      <div class="col-3-old stage-wrappers" style="flex: none;" id="stage4">
        <span>4</span>
        <p >مشاهده میزان اعتبار ریالی در پروفایل کاربری</p>
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
  data(){
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
  /*created() {
    this.importFluid();
  }*/
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

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables.scss';

p{
  margin-bottom: 0;
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .home-head {
    h1 {
      font-size: 100px !important;
    }
    h2 {
      font-size: 200px !important;
      left: -100px !important;
    }
    p{
      font-size: 30px !important;
      line-height: 1.3;
    }
  }
}
</style>
