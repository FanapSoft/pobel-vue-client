// action types
export const LOGOUT = "logout";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_PASSWORD = "setPassword";
export const SET_ERROR = "setError";
export const SET_IS_AUTHENTICATED = "setIsAuthenticated";

//both
export const SET_AUTH = "setUser";


const state = () => ({
  errors: null,
  user: null,
  isAuthenticated: false
});

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [SET_AUTH](context, user) {
    let {
      state,
      commit,
    } = context;

    commit('setIsAuthenticated', true)
    //First save the user
    commit(SET_AUTH, user)
    this.$jwtService.saveToken(state.user.id_token);
    //Then use token for the request to get the user
    this.$apiService.setHeader();
    return new Promise((resolve, reject) => {
      this.$apiService
          .get(`/api/User/Get/${user.uid}`)
          .then(response => {
            if(response.status > 400 && response.data[0] && response.data[0].code === 2004) {
              context.dispatch(LOGOUT)
              return;
            }
            commit(SET_AUTH, {
              ...user,
              ...state.user,
              ...response.data
            });
            this.$userService.saveUser(state.user);
            resolve(true);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    this._vm.$set(state,'errors', error);
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    this._vm.$set(state,'isAuthenticated',false);
    this._vm.$set(state,'user', {});
    this._vm.$set(state,'errors', {});

    //Remove from localstorage
    this.$jwtService.destroyToken();
    this.$userService.destroyUser();
  },
  [SET_AUTH](state, user) {
    this._vm.$set(state,'user',user);
  },
  [SET_IS_AUTHENTICATED](state, val) {
    this._vm.$set(state,'isAuthenticated',val);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
