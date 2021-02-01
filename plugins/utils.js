const Utils = {
    install(context, inject) {
        //Vue.$utils = Utils;
        //Vue.prototype.$utils = Utils;
      inject('utils', Utils);
      context.$utils = Utils;
    },

    addParamsToUrl(url, params) {
        if(!url)
            throw Error('Url is required');

        let isNotFirstParam = false
        if(params && Object.keys(params).length) {
            url += '?';
            Object.keys(params).forEach(item => {
                if(params[item]){
                    if(isNotFirstParam)
                        url += '&';
                    url += `${item}=${params[item]}`;
                }
                if(!isNotFirstParam) {
                    isNotFirstParam = true;
                }
            });
        }

        return url;
    },
    routeOption(route, key, value) {
    return route.matched.some((m) => {
      if (process.client) {
        // Client
        return Object.values(m.components).some(
          (component) => component.options && component.options[key] === value
        )
      } else {
        // SSR
        return Object.values(m.components).some((component) =>
          Object.values(component._Ctor).some(
            (ctor) => ctor.options && ctor.options[key] === value
          )
        )
      }
    })
  }
}

export default Utils.install

