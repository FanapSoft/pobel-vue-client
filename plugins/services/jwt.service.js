const ID_TOKEN_KEY = "id_token";

let jwtService = {
  getToken() {
    return window.localStorage.getItem(ID_TOKEN_KEY);
  },
  saveToken(token) {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
  },
  destroyToken () {
    window.localStorage.removeItem(ID_TOKEN_KEY);
  }
}

export default (context, inject) => {
  inject('jwtService', jwtService);
  context.$jwtService = jwtService;
}

