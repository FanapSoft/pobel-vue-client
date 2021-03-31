import Vue from "vue";
import VueI18n from "vue-i18n";

// Localisation language list
import { locale as en } from "@/i18n/en";
import { locale as ch } from "@/i18n/ch";
import { locale as es } from "@/i18n/es";
import { locale as jp } from "@/i18n/jp";
import { locale as de } from "@/i18n/de";
import { locale as fr } from "@/i18n/fr";
import { locale as fa } from "@/i18n/fa";

Vue.use(VueI18n);

let messages = {};
messages = { ...messages, en, ch, es, jp, de, fr, fa };

// get current selected language
const lang = localStorage.getItem("language") || "en";

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang, // set locale
  messages // set locale messages
});

export default function (context, inject) {
  context.app.i18n = i18n
};
