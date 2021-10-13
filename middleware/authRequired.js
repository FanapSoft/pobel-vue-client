export default async function (context) {
  let {
    store,
    $userService,
    $apiService,
    redirect
  } = context;

  if(!store.getters["auth/isAuthenticated"]) {
    //is not authorized, check if token is saved in browser
    redirect($apiService.loginUrl)
  }
}
