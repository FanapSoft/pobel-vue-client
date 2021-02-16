export default function (context) {
  let {
    $axios,
    nuxtError,
    $apiService,
    $jwtService
  } = context;
  $axios.defaults.validateStatus = () => {//status
    return true;
  };

  /* $axios.onError(error => {
    nuxtError({
      statusCode: error.response.status,
      message: error.message,
    });
    return Promise.resolve(false);
  }) */

  $axios.onRequest(req => {
    req.headers.Authorization = `Bearer ${$jwtService.getToken()}`;
    return req;
  })


  $axios.onRequest(req => {
    req.headers.Authorization = `Bearer ${$jwtService.getToken()}`;
    return req;
  });

  $axios.onResponse(response => {
    //return response;
    if(response.status >= 400) {
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
      console.log("User has been logged out! Redirecting back to login page ...");
      window.location.href = $apiService.loginUrl;
    }

    return error;
  })

}
