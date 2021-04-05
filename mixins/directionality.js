export default {
  mounted() {
    let body = document.querySelector('body');
    if (this.$isRTL) {

      body.setAttribute("direction", "rtl");
      body.setAttribute("dir", "rtl");
      body.style.direction = "rtl";
      body.classList.add("rtl");

      import("~/assets/scss/styles.rtl.scss");

      this.$vuetify.rtl = true;
    } else {
      body.setAttribute("direction", "ltr");
      body.setAttribute("dir", "ltr");
      body.style.direction = "ltr";
      body.classList.add("ltr");


      import("~/assets/scss/styles.ltr.scss")
      this.$vuetify.rtl = false;
    }
  }
}
