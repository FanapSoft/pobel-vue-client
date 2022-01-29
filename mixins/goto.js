export default {
  methods: {
    goto(refName) {
      let element = this.$refs[refName]
        , top;
      if(element.offsetTop)
        top = element.offsetTop;
      else if (element.$el && element.$el.offsetTop)
        top = element.$el.offsetTop;

      window.scrollTo(0, top );
    }
  }
}
