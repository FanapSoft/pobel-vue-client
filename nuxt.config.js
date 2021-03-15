import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,//process.env.NODE_ENV === 'production' ,
  generate: {
    exclude: [
      /^\/dataset\//, // path starts with /dataset
      /^\/datasets/,
      /^\/dashboard/,
      /^\/labeling\//,
      /^\/auth\//,
      /^\/loggedIn\//,
    ]
  },
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  router: {
    middleware: ['checkAuth'],
    base: ''//process.env.NODE_ENV == 'production' ? '/test/' : ''
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - POBEL',
    title: 'POBEL',
    htmlAttrs: {
      lang: 'fa'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Labeling Application' },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      { rel: 'shortcut icon', href: '/favicon.png' },
      { rel:"stylesheet", href:"https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" },
      { rel:"stylesheet", href:"https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" },
    ],
    script: [
      {hid:'123', src: 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js', defer: true}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~/plugins/external/Modal/index.css",
    "~/assets/scss/styles" //This project styles
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/utils', mode: 'client' },
    { src: '~/plugins/moment', mode: 'client' },
    { src: '~/plugins/services/jwt.service', mode: 'client' },
    { src: '~/plugins/services/api.service', mode: 'client' },
    { src: '~/plugins/services/user.service', mode: 'client' },
    { src: '~/plugins/axios', mode: 'client' },
    //'~/plugins/services/mock.service', //Temporary only for test

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    "@nuxtjs/svg"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  axios: {
    baseURL: 'http://10.56.16.50:8888', // Used as fallback if no runtime config is provided
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    rtl: true,
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    options: {
      customProperties: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  loading: {
    color: '#ff257c',
  }
}
