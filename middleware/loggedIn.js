import { SET_AUTH } from "../store/auth"

export default function (context) {
  let {
    $axios,
    $jwtService,
    route = context.route,
    store,
    redirect
  } = context;

  if (route.query.token) {
    const token = route.query.token
    $jwtService.saveToken(token);
    store.dispatch(`auth/${SET_AUTH}`, {uid: route.params.id, id_token: token});
  }

  redirect("/")
}
