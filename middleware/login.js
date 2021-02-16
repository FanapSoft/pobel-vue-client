export default function (context) {
  const loginUrl = `http://10.56.16.50:8888/pod/authentication${(process.env.NODE_ENV !== 'production'? "/true" : '')}`;
  context.redirect(loginUrl)
}
