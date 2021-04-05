import moment from "jalali-moment"

export default function (context, inject) {

  inject('moment', moment);
  context.$moment = moment;


}
