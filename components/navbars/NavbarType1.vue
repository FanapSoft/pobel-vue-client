<template>
  <nav class="nav">
    <ul
      v-if="!$vuetify.breakpoint.smAndDown" class="links">
      <template
        v-for="item in items">
        <li
          v-if="!item.onlyLoggedIns || isAuthenticated">
          <NuxtLink

            :to="item.link">{{item.title}}</NuxtLink>
        </li>
      </template>
    </ul>
    <template v-else>
      <ul style="z-index: 2" class="links">
        <template >
          <v-btn
             text fab small
            @click="() => navigationDrawer = true"

            color="#741457">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
      </ul>
      <v-navigation-drawer
        app
        :right="$isRTL"
        v-model="navigationDrawer"

      style="z-index: 3">
        <v-list >
          <template


            v-for="(item, index) in items" >
            <v-list-item
              link

              v-if="!item.onlyLoggedIns || isAuthenticated"

              :to="item.link" >
              <v-list-item-content>
                {{item.title}}
              </v-list-item-content>
            </v-list-item>
          </template>

        </v-list>
      </v-navigation-drawer>
    </template>

    <ul style="padding-left: 0">
      <li >
        <v-menu
          style="z-index: 99999"
          transition="slide-y-transition"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-img
              v-bind="attrs"
              v-on="on"
              :src="languageFlag || getLanguageFlag"

              class="h-20px w-20px rounded-sm"
              :alt="activeLanguage.lang"
              max-height="23"
              max-width="25"
              style="cursor: pointer"
            />
<!--            <v-btn


              elevation="0"
              style="background-color: transparent;height: auto; color: inherit;"
            >
              lang
            </v-btn>-->
          </template>
          <v-list >
            <v-list-item
              v-for="(item, i) in languages"

              :key="i"
              @click="selectedLanguage(item)">
              <v-list-item-avatar rounded>
                <v-img
                  :src="item.flag"
                  :alt="item.lang"

                  max-height="23"
                  max-width="25"/>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ $t(item.translationKey) }}</v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list>
        </v-menu>
      </li>
      <li v-if="isAuthenticated">
        <NuxtLink to="/dashboard">سلام
          {{user.name}}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          v-if="!isAuthenticated" to="/auth/login">ورود</NuxtLink>
        <NuxtLink
          v-else

          to="/auth/logout">خروج</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script>
import {mapState, mapGetters} from "vuex"

export default {
  name: "NavbarType1",
  data() {
    return {
      navigationDrawer: false,
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

      ],
      languages: this.$i18nService.languages,
      languageFlag: "",
    }
  },
  computed: {
    ...mapGetters({
      user: "auth/currentUser",
      isAuthenticated: "auth/isAuthenticated"
    }),
    activeLanguage() {
      return this.$i18nService.getActiveLanguage();
    },
    getLanguageFlag() {
      return this.onLanguageChanged();
    }
  },
  methods: {
    selectedLanguage(item) {
/*
      const el = e.target.closest(".navi-link");
      const lang = el.getAttribute("data-lang");
*/

      this.$i18nService.setActiveLanguage(item.lang);

      this.languageFlag = this.languages.find(val => {
        return val.lang === this.$i18nService.getActiveLanguage();
      }).flag;

      /*this.$emit(
        "language-changed",
        this.languages.find(val => {
          return val.lang === lang;
        })
      );*/

      window.location.reload();
    },
    onLanguageChanged() {
      this.languageFlag = this.languages.find(val => {
        return val.lang === this.$i18nService.getActiveLanguage();
      }).flag;
    },
    isActiveLanguage(current) {
      return this.activeLanguage === current;
    }
  }
}
</script>

<style >
header {
  color: #741457;
  padding: 20px;
  background-color: transparent;
  margin-bottom: 30px;
  position: relative;
}

header:after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(to top, #f3f3f3, transparent);
  z-index: 1;
}

.nav {
  width: 100%;
  height: 56px;
  display: flex;
  padding: 0 32px;
  position: relative;
  background: transparent;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  z-index: 9;
  top: 0;
  font-size: 14px;
  color: inherit !important;
}

.nav ul {
  color: inherit !important;
}

.nav::after {
  opacity: 0;
  content: '';
  transition: opacity var(--transition-duration);
  will-change: opacity;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.stuck::after {
  opacity: 1;
}

.logo {
  height: 24px;
  z-index: 1;
}

.nav li {
  display: inline-block;
  position: relative;
  margin-left: 24px;
  list-style: none;
  float: right;
  z-index: 1;
  color: inherit !important;
}

.nav li a,
.nav li a span {
  text-decoration: none;
  color: inherit !important;
}

.nav li a:hover {
  color: #b7003f;
}

.link_external {
  position: relative;
  padding-right: 8px;
}

.links li {
  float: none;
  margin-left: 0;
  margin-right: 24px;
}

@media screen and (max-width: 421px) {
  .nav {
    font-size: 75%;
    padding: 0 16px;
  }
  .nav li {
    margin-left: 16px;
  }
  .links li {
    margin-left: 0;
    margin-right: 16px;
  }
}

</style>
