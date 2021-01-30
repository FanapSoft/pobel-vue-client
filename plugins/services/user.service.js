const UserFieldKey = "userObject";

const userService = {
  getUser () {
    return (window.localStorage.getItem(UserFieldKey) ?  JSON.parse(window.localStorage.getItem(UserFieldKey)) : false);
  },
  saveUser (user) {
    window.localStorage.setItem(UserFieldKey, JSON.stringify(user));
  },
  destroyUser () {
    window.localStorage.removeItem(UserFieldKey);
  }
}

export default (context, inject) => {
  inject('userService', userService);
  context.$userService = userService;
}
