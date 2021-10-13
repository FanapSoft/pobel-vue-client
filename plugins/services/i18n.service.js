const i18nService = {
  defaultLanguage: "fa",
  languages: [
    {
      lang: "en",
      name: "English",
      translationKey: "GENERAL.ENGLISH",
      flag: "/images/flags/226-united-states.svg",
      isRTL: false
    },
    /*{
      lang: "ch",
      name: "Mandarin",
      flag: process.env.BASE_URL + "/media/svg/flags/034-china.svg"
    },
    {
      lang: "es",
      name: "Spanish",
      flag: process.env.BASE_URL + "/media/svg/flags/128-spain.svg"
    },
    {
      lang: "jp",
      name: "Japanese",
      flag: process.env.BASE_URL + "/media/svg/flags/063-japan.svg"
    },
    {
      lang: "de",
      name: "German",
      flag: process.env.BASE_URL + "/media/svg/flags/162-germany.svg"
    },
    {
      lang: "fr",
      name: "French",
      flag: process.env.BASE_URL + "/media/svg/flags/195-france.svg"
    },*/
    {
      lang: "fa",
      name: "Persian",
      translationKey: "GENERAL.PERSIAN",
      flag: "images/flags/136-iran.svg",
      isRTL: true
    },
  ],

  /**
   * Keep the active language in the localStorage
   * @param lang
   */
  setActiveLanguage(lang) {
    localStorage.setItem("language", lang);
  },

  /**
   * Get the current active language
   * @returns {string | string}
   */
  getActiveLanguage() {
    return localStorage.getItem("language") || this.defaultLanguage;
  },

  /**
   * Get the current active language
   * @returns {object}
   */
  getActiveLanguageObject() {
    return this.languages.filter(item => item.lang === i18nService.getActiveLanguage())[0]
  }


};

export default function (context, inject) {
  inject('i18nService', i18nService);
  context.$i18nService = i18nService;

  inject('isRTL', i18nService.getActiveLanguageObject().isRTL);
  context.$isRTL = i18nService.getActiveLanguageObject().isRTL;

  inject('langIsFa', i18nService.getActiveLanguage() === 'fa');
  context.$langIsFa = i18nService.getActiveLanguage() === 'fa';
};
