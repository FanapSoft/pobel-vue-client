export default function (context) {
  let {
    $axios,
    nuxtError,
    route,
    $apiService,
    $jwtService,
    $utils,
    store
  } = context;
  $axios.defaults.validateStatus = () => {//status
    return true;
  };

  $axios.onRequest(req => {
    req.headers.Authorization = `Bearer ${$jwtService.getToken()}`;
    return req;
  });

  $axios.onResponse(response => {
    if (response.status === 401) {
      store.dispatch("auth/logout");
      window.location.reload();
    }

    if(response.status >= 400 && !$utils.routeOption(route, 'auth', false)) {
      if (response.status === 401) {
        console.log("User has been logged out! Redirecting back to login page ...");
        window.location.href = $apiService.loginUrl;

      }

      if(response.data && response.data.unAuthorizedRequest) {
        window.location.href = $apiService.loginUrl;
      }

      throw response;
    } else {
      return response;
    }
  });

  $axios.onResponseError( error => {

    console.log(error)
    if (error.response && error.response.status === 401) {
      //console.log("User has been logged out! Redirecting back to login page ...");
      //window.location.href = $apiService.loginUrl;
    }

    return error;
  })
}
