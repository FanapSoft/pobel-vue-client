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
  },
  getMatchedComponents(route, matches) {
    return [].concat(
      ...[],
      ...route.matched.map(function (m, index) {
        return Object.keys(m.components).map(function (key) {
          matches.push(index)
          return m.components[key]
        })
      })
    )
  },
  /**
   * Returns toFixed of numbers
   * @param value
   * @param number
   * @returns {null|*|string|string}
   */
  toFixed(value, number) {
    if(!value)
      return '0';
    let num = number? number : 2;

    if(number) {
      num = number
    }

    return value.toFixed(num);
  },
  /**
   * Formats the value like iran money
   * @param value
   * @param number
   * @returns {null|*|string|string}
   */
  formatNumber (value, number) {
    if(!value)
      return '0';
    let num = number ? number : 3;
    let re = new RegExp("\\B(?=(\\d{" + num + "})+(?!\\d))", "g");
    return value.toString().replace(re, ",");
  }
}

export default Utils.install

