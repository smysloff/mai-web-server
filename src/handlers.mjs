
// src/handlers.mjs

import { isString, throwTypeError } from './utils.mjs'
import HttpServer from './HttpServer.mjs'

export function defaultError404(request, response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Error 404: Page Not Found')
}

export function addAppToRequest(app) {
  if (!(app instanceof HttpServer)) {
    throwTypeError('app', 'HttpServer', typeof app)
  }
  return function (request, response, next) {
    request.app = app
    next()
  }
}

export function addOriginalUrlToRequest(request, response, next) {
  request.originalUrl = request.url
  next()
}

// @todo addBodyToRequest
// @todo addCookiesToRequest

export function addHostToRequest(request, response, next) {
  request.host = request.headers[':authority'] // HTTP2
              || request.headers['host']       // HTTP1
              || 'localhost'
  next()
}

export function addHostnameToRequest(request, response, next) {
  request.hostname = request.host.replace(/:\d+$/, '')
  next()
}

export function addIpToRequest(request, response, next) {

  const { socket, headers } = request
  const { remoteAddress } = socket
  const forwarded = headers['x-forwarded-for']
  const realIp = headers['x-real-ip']

  if (forwarded) {
    request.ip = forwarded.split(',')[0].trim()
  }

  else if (realIp) {
    request.ip = realIp
  }

  return remoteAddress

  next()
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
