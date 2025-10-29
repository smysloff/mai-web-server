
// src/handlers.mjs

import { isString } from './utils.mjs'

export function defaultError404(_, response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Error 404: Page Not Found')
}

export function staticFiles(directory) {

  if (!isString(directory)) {
    throw new TypeError(`'directory' must be a string type but passed ${ typeof directory }`)
  }

  return function (request, response, next) {

    const { url, headers, connection, socket } = request

    const host = headers[':authority'] || headers['host'] || 'localhost'
    const hostname = host.replace(/:\d+$/, '')

    let scheme = 'http'
    if (headers[':scheme']) {
      scheme = headers[':scheme'] // HTTP/2
    } else if (connection.encrypted || socket.encrypted) {
      scheme = 'https' // HTTP/1 over TLS
    }

    // @todo

    const location = `${ scheme }://${ host }${ url }`

    const _url = new URL(location)

    console.log(_url)

    next()
  }

}
