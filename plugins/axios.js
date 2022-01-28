import Modal from "@/plugins/external/Modal";

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
    req.headers.token = `${$jwtService.getToken()}`;
    return req;
  });

  $axios.onResponse(response => {
    if (response.status >= 400) {
      if (response.status === 401) {
        store.dispatch("auth/logout");
        window.location.reload();
      }

      if (!$utils.routeOption(route, 'auth', false)) {
        if (response.data && response.data.unAuthorizedRequest) {
          window.location.href = $apiService.loginUrl;
        }
      }

      if(response.data[0] && response.data[0].code === 2004 ) {
        window.location.href = $apiService.loginUrl;
      }

      if(response.data[0] && response.data[0].code === 3700) {
        let alertModal = Modal({
          title: context.app.i18n.t('TEXTS.ACCOUNT_INACTIVE'),
          body: context.app.i18n.t('TEXTS.ACCOUNT_INACTIVE_DESC'),
          backgroundColor: 'linear-gradient(to right, #26a247 0%, #2cbf4a 100%)',
        });
      }
      return response;
    } else {
      return response;
    }
  });

  $axios.onResponseError(error => {

    //console.log(error)
    if (error.response && error.response.status === 401) {
      //console.log("User has been logged out! Redirecting back to login page ...");
      //window.location.href = $apiService.loginUrl;
    }

    return  error;
  })
}
