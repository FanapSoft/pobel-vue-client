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
  isAuthenticated: false//!!JwtService.getToken()
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
      commit
    } = context;

    commit('setIsAuthenticated', true)
    //First save the user
    commit(SET_AUTH, user)
    this.$jwtService.saveToken(state.user.token);
    //Then use token for the request to get the user
    this.$apiservice.setHeader();
    return new Promise((resolve, reject) => {
      this.$apiservice
          .get(`/api/services/app/User/Get?id=${user.uid}`)
          .then(response => {
            commit(SET_AUTH, {
              ...user,
              ...state.user,
              ...response.data.result
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
    state.errors = error;
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    this.$jwtService.destroyToken();
    this.$userService.destroyUser();
  },
  [SET_AUTH](state, user) {
    state.user = user
  },
  [SET_IS_AUTHENTICATED](state, val) {
    state.isAuthenticated = val
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
