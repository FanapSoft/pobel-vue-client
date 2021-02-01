<template>
  <div>
    <NuxtLink to="/auth/login">Login</NuxtLink>
    <NuxtLink to="/auth/logout">logout</NuxtLink>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  layout: "main",
  auth: false,
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
