import Vue from "vue";
import VueI18n from "vue-i18n";

// Localisation language list
import { locale as en } from "@/i18n/en";
import { locale as fa } from "@/i18n/fa";

Vue.use(VueI18n);

let messages = {};
messages = { ...messages, en, fa };

// get current selected language
const lang = localStorage.getItem("language") || "fa";

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang, // set locale
  messages // set locale messages
});

export default function (context, inject) {
  context.app.i18n = i18n
};
