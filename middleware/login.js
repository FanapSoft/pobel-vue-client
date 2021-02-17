export default function (context) {
  let {
    $apiService
  } = context;
  context.redirect($apiService.loginUrl);
}
