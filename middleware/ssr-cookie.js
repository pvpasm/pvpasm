export default function({ isServer, req, $axios }) {
  if (isServer) {
    $axios.defaults.headers.common.cookie = req.headers.cookie
  }
}
