<template>
  <v-app class="app">
<!--    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-item
          v-for="item of items"
          :key="item.title"
          :to="item.path">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <NuxtLink
          flat
          v-for="item in items"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </NuxtLink>
      </v-toolbar-items>
    </v-toolbar>-->

    <top-bar></top-bar>

    <main class="wrapper">
<!--      <v-container>-->
        <nuxt />
<!--      </v-container>-->
    </main>
  </v-app>
</template>

<script>
import NavbarType1 from "../components/navbars/NavbarType1";
import TopBar from "../components/TopBar";

export default {
  components: {TopBar, NavbarType1},
  data () {
    return {
      title: 'پابل',
      sidebar: false,
      items: [
        {
          title: "صفحه اصلی",
          link: "/"
        },
        {
          title: "مشارکت",
          link: "/datasets",
          onlyLoggedIns: true
        },
        {
          title: "سوالات متداول",
          link: "/faq"
        },
        {
          title: "تماس با ما",
          link: "/contact"
        },
        {
          title: "",
          link: ""
        },

      ],
      leftItems: [
        {
          title: "",
          link: ""
        },
        {
          title: "",
          link: ""
        },

      ]
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss">
.v-application {
  font-family: IranSans;
  .title {
    font-family: IranSans;
  }
}
</style>
