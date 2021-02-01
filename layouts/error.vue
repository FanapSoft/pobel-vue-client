<template>
  <component :is="errorPage"></component>
<!--  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>-->
</template>

<script>
import error404 from "~/components/404"
export default {
  components: {
    error404
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    errorPage() {
      if (this.error.statusCode === 404) {
        return error404;
      }      // catch everything else
      return error404;
      //return error500;
    },
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
