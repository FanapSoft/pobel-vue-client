/**
 * Service to call HTTP request via Axios
 */
import error from "@/layouts/error";

const config = {
  HOST_ADDRESS: (process.env.NODE_ENV === 'production' ? process.env.NUXT_ENV_API_URL_PROD : process.env.NUXT_ENV_API_URL_LOCAL),
  APP_URL: (process.env.NODE_ENV === 'production' ? encodeURI(process.env.NUXT_ENV_URL_PROD) : encodeURI(process.env.NUXT_ENV_URL_LOCAL)),
}

const ApiService = {
  //http://10.56.16.50:8888
  loginUrl: `${config.HOST_ADDRESS}/auth?host=${config.APP_URL}`,
  axios: null,
  jwtService: null,
  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    this.axios.defaults.headers.common["token"] = `${this.jwtService.getToken()}`;
  },

  async get(url, params){
    return  await this.axios.get(url, {
      params: params
    });
  },
  async post(url, params){
    return  await this.axios.post(url, params);
  }


  /*query(resource, params) {
    return this.axios.get(resource, params).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /!**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   *!/
  get(resource) {
    return this.axios.get(`${resource}`).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /!**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   *!/
  post(resource, params) {
    return this.axios.post(`${resource}`, params);
  },

  /!**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   *!/
  update(resource, slug, params) {
    return this.axios.put(`${resource}/${slug}`, params);
  },

  /!**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   *!/
  put(resource, params) {
    return this.axios.put(`${resource}`, params);
  },

  /!**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   *!/
  delete(resource) {
    return this.axios.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }*/
};

export default (context, inject) => {
  ApiService.axios = context.$axios;
  ApiService.jwtService = context.$jwtService;

  inject('apiService', ApiService);
  context.$apiService = ApiService;
}
