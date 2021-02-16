<template>
  <nav class="nav">
    <ul class="links">
      <template  v-for="item in items">
        <li v-if="!item.onlyLoggedIns || isAuthenticated">
          <NuxtLink

            :to="item.link">{{item.title}}</NuxtLink>
        </li>
      </template>

    </ul>

    <ul style="padding-left: 0">
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
  computed: {
    ...mapGetters({
      user: "auth/currentUser",
      isAuthenticated: "auth/isAuthenticated"
    })
  },
  mounted() {
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
