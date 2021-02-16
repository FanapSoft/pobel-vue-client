import moment from "jalali-moment"

export default function (context, inject) {
  let {
    $axios,
    nuxtError,
    $apiService,
    $jwtService
  } = context;

  inject('moment', moment);
  context.$moment = moment;


}
