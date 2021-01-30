/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  loginUrl: `http://10.56.16.50:8888/pod/authentication${(process.env.NODE_ENV !== 'production'? "/true" : '')}`,
  axios: null,
  jwtService: null,
  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    this.axios.defaults.headers.common["Authorization"] = `Bearer ${this.jwtService.getToken()}`;
  },

  query(resource, params) {
    return this.axios.get(resource, params).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource) {
    return this.axios.get(`${resource}`).catch(error => {
      // console.log(error);
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return this.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return this.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return this.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return this.axios.delete(resource).catch(error => {
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default (context, inject) => {
  ApiService.axios = context.$axios;
  ApiService.jwtService = context.$jwtService;

  inject('apiService', ApiService);
  context.$apiService = ApiService;
}
