import {SET_AUTH} from "../store/auth";

export default async function (context) {
  let {
    store,
    $jwtService,
    $userService,
    $apiService,
    $utils,
    route,
    redirect
  } = context;

  if($utils.routeOption(route, 'auth', false)) {
    return;
  }

  if(!store.getters["auth/isAuthenticated"]) {
    //is not authorized, check if token is saved in browser
    if($jwtService.getToken() && $userService.getUser()) {
      await store
        .dispatch(`auth/${SET_AUTH}`, {token: $jwtService.getToken(), uid: $userService.getUser().uid})
        //.then(() => {})
        .catch(error => console.log(error));
    } else {
      redirect($apiService.loginUrl)
    }
  }
}
