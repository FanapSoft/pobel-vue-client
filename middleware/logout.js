import {LOGOUT} from "../store/auth"
export default function (context) {
  let {
    store,
    redirect
  } = context;

  store.dispatch(`auth/${LOGOUT}`);
  redirect("/");
}
