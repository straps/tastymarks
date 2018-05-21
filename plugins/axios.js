import * as axios from 'axios'

let options = {}

// The server-side needs a full url to work
if (process.server) {
  const prod = process.env.NODE_ENV === 'production'
  const protocol = prod ? 'https' : 'http'
  const host = prod ? 'tastymarks.com' : 'localhost'
  const port = prod ? 443 : 3000
  options.baseURL = `${protocol}://${host}:${port}`
  options.https = prod
}

export default axios.create(options)
