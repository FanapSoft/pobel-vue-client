const Utils = {
    context: null,
    install(context, inject) {
        //Vue.$utils = Utils;
        //Vue.prototype.$utils = Utils;
        inject('utils', Utils);
        context.$utils = Utils;

        console.log(context, context.app.i18n.t)
        Utils.context = context;
    },

    addParamsToUrl(url, params) {
        if (!url)
            throw Error('Url is required');

        let isNotFirstParam = false
        if (params && Object.keys(params).length) {
            url += '?';
            Object.keys(params).forEach(item => {
                if (params[item]) {
                    if (isNotFirstParam)
                        url += '&';
                    url += `${item}=${params[item]}`;
                }
                if (!isNotFirstParam) {
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
        if (!value)
            return '0';
        let num = number ? number : 2;

        if (number) {
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
    formatNumber(value, number) {
        if (!value)
            return '0';
        let num = number ? number : 3;
        let re = new RegExp("\\B(?=(\\d{" + num + "})+(?!\\d))", "g");
        return value.toString().replace(re, ",");
    },

    validators: {
        /**
         * This field is required and cant't be left empty
         * @param value
         * @returns {boolean|string}
         */
        required: value => !!value || Utils.context.app.i18n.t('VALIDATION.FIELDISREQUIRED'),
        /**
         * Only numbers are allowed
         * @param value
         * @returns {boolean|string}
         */
        onlyNumbers: value => {
            const pattern = /^(\d)*$/;
            if (!value || pattern.test(value)) {
                return true;
            } else {
                return 'فقط عدد مجاز است';
            }
        },
        /**
         * Only posetive and negative numbers are allowed
         * @param value
         * @returns {boolean|string}
         */
        onlyNumberAndHyphen: value => {
            const pattern = /^(-)*(\d)*$/;
            if (!value || pattern.test(value)) {
                return true;
            } else {
                return 'فقط عدد مجاز است';
            }
        },
        /**
         * Only Iran money format is allowed
         * @param value
         * @returns {boolean|string}
         */
        onlyMoney: value => {
            const pattern = /^[\d,]*$/;
            return pattern.test(value) || 'فقط فرمت پول مجاز است';
        },
        /**
         * Hyphen is not allowed
         * @param variable
         * @param number
         * @returns {boolean|string}
         */
        noHyphen: value => value.trim() != '-' || 'مقدار وارد شده معتبر نیست.',
        /**
         * Variable length must be less than number
         * @param variable
         * @param number
         * @returns {boolean|string}
         */
        maxChars(variable, number) {
            return variable.length <= number || 'حداکثر ' + number + ' کاراکتر مجاز است'
        },
        /**
         * Variable length must be exactly same as length or null
         * @param variable
         * @param length
         * @returns {boolean|string}
         */
        fixedLength(variable, length) {
            return ((variable != null && variable.length == length) || !variable) || 'طول فیلد باید ' + length + ' کاراکتر باشد'
        },
        /**
         * Variable must be between minLength and maxLength
         * @param variable
         * @param minLength
         * @param maxLength
         * @returns {boolean|string}
         */
        betweenLength(variable, minLength, maxLength) {
            return ((variable != null && variable.length <= maxLength && variable.length >= minLength) || !variable) || `طول فیلد باید بین ${minLength} تا ${maxLength}  کاراکتر باشد. `
        },
        /**
         * String must starts with chars
         * @param variable
         * @param chars
         * @returns {string|boolean}
         */
        startsWith(variable, chars) {
            if (variable && variable.length) {
                const pattern = new RegExp('^' + chars);
                if (pattern.test(variable)) {
                    return true;
                } else {
                    return 'باید با ' + chars + 'شروع شود';
                }
            } else {
                return true;
            }
        },
        /**
         * Only iran mobile format is allowed
         * @param value
         * @returns {boolean | string}
         */
        iranmobile: value => {
            console.log(this);
            const pattern = /^09\d{9}$/;
            return pattern.test(value) || Utils.context.app.i18n.t('VALIDATION.EXAMPLEVALIDMOBILE');
        },
        /**
         * value must contains atleast one space
         * @param value
         * @param message
         * @returns {boolean | string}
         */
        oneSpace(value, message) {
            return (value && value.split(' ').length > 1) || (message || 'حداقل 2 کلمه')
        },
        notEmpty: value => {
            if (value && value.toString().length) {
                return true
            } else {
                return 'فیلد نباید خالی باشد'
            }
            // return value.length > 0 ||  'فیلد نباید خالی باشد'
        },
        minNumber(value, min) {

            if (value >= min) {
                return true
            } else {
                return `کمتر از ${min} مجاز نیست`
            }
        },
        maxNumber(value, max) {


            if (value <= max) {
                return true
            } else {
                return `بیشتر از ${max} مجاز نیست`
            }
        },

    },
}

export default Utils.install

