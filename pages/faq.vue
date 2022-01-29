<template>
  <div class="container-old" >
    <div class="row-old  faq">
      <div class="col-12-old ">
        <h2>{{$t('GENERAL.FREQUENTLYANSKEDQUESTIONS')}}</h2>

        <ul class="accordion" id="faq-accordion">
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ13')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA13') }}
              <a href="https://space.pod.ir/public/folders/S7B8UPE6L6PR6G2V" target="_blank"> {{$t('TEXTS.FAQA13_2') }}</a>
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ1')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA1')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ2')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA2')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ3')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA3')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ4')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA4')}}
           </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ5')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA5')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ6')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA6')}}
            </p>
          </li>

          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ7')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA7')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ8')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA8')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ9')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA9')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ10')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA10')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ11')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA11')}}
            </p>
          </li>
          <li>
            <span class="mark"></span>
            <p class="title">{{$t('TEXTS.FAQQ12')}}</p>
            <p class="body">
              {{$t('TEXTS.FAQA12')}}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  name: "faq",
  auth: false,
  mounted() {
    var accordionLists = document.getElementsByClassName('title');

    for (let i = 0; i < accordionLists.length; i++) {
      accordionLists[i].addEventListener("click", function (e) {
        if (!this.parentNode.classList.contains('active')) {
          this.parentNode.classList.add('active');
          this.parentNode.querySelector('.body').style.height = "auto";

          var height = this.parentNode.querySelector('.body').clientHeight + 20 + "px";
          this.parentNode.querySelector('.body').style.height = "0px";

          setTimeout(() => {
            this.parentNode.querySelector('.body').style.height = height;
            this.parentNode.querySelector('.body').style.padding = '10px 10px 10px 0';
          }, 0);
        } else {
          this.parentNode.querySelector('.body').style.height = "0px";
          this.parentNode.querySelector('.body').style.padding = "0px 10px 0px 0px";
          this.parentNode.addEventListener('transitionend', () => {
            this.parentNode.classList.remove('active');
          }, {once: true});
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.faq .container-old {
  padding: 0;
}
.faq .accordion .title {
  font-family: IranSans !important;
  font-size: 1em !important;
}

.faq .accordion p {
  font-family: IranSans !important;
  font-size: 1em !important;
  margin-bottom: 0;
}

.rtl {
  .faq {
    .accordion {
      li {
        padding-right: 30px;
      }
    }
  }
}
.ltr {
  .faq {
    .accordion {
      li {
        padding-left: 30px;
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .faq {
    h2 {
      font-size: 1.5em !important;
    }

    .accordion {
      .title {
        font-size: .8em !important;
      }
      p{
        font-size: .8em !important;
      }
    }
  }
}
</style>
