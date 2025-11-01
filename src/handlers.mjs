
// src/handlers.mjs

import {
  getReadableIP,
  getUrl,
  isFunction.
  isString,
  throwTypeError,
} from './utils.mjs'

export function defaultError404(request, response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Error 404: Page Not Found')
}

export function addAppToRequest(app) {

  if (
    !app
    || !isFunction(app.use)
    || !isFunction(app.get)
    || !isFunction(app.post)
  ) {
    throwTypeError('app', 'HttpServer-like object', typeof app)
  }

  return function(request, response, next) {
    request.app = app
    next()
  }
}

export function addBaseUrlToRequest(request, response, next) {
  // @todo
  next()
}

export function addBodyToRequest(request, response, next) {
  // @todo
  next()
}

export function addCookiesToRequest(request, response, next) {
  // @todo
  next()
}

export function addFreshToRequest(request, response, next) {
  // @todo
  next()
}

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
  const realIP = headers['x-real-ip']

  let ip

  if (forwarded) {
    ip = forwarded.split(',')[0].trim()
  } else if (realIP) {
    ip = realIP
  } else {
    ip = remoteAddress
  }

  request.ip = getReadableIP(ip)

  next()
}

export function addIpsToRequest(request, response, next) {
  // @todo
  next()
}

export function addMethodToRequest(request, response, next) {
  // @todo
  next()
}

export function addOriginalUrlToRequest(request, response, next) {
  request.originalUrl = request.url
  next()
}

export function addParamsToRequest(params = {}) {

  if (typeof params !== 'object') {
    throwTypeError('params', 'object', typeof params)
  }

  return function(request, response, next) {
    request.params = params
    next()
  }
}

export function addPathToRequest(request, response, next) {
  const scheme = request.socket.encrypted ? 'https' : 'http'
  const url = getUrl(request.hostname, request.url, scheme === 'https')
  request.path = url.pathname
  next()
}

export function addPathToRequest(request, response, next) {
  // @todo
  next()
}

export function addProtocolToRequest(request, response, next) {
  // @todo
  next()
}

export function addQueryToRequest(request, response, next) {
  // @todo
  next()
}

export function addResponseToRequest(request, response, next) {
  // @todo
  next()
}

export function addRouteToRequest(request, response, next) {
  // @todo
  next()
}

export function addSecureToRequest(request, response, next) {
  // @todo
  next()
}

export function addSignedCookiesToRequest(request, response, next) {
  // @todo
  next()
}

export function addStaleToRequest(request, response, next) {
  // @todo
  next()
}

export function addSubdomainsToRequest(request, response, next) {
  // @todo
  next()
}

export function addXhrToRequest(request, response, next) {
  // @todo
  next()
}

export function addLocationToRequest(request) {
  // @todo
  next()
}

export function staticFiles(directory) {

  if (!isString(directory)) {
    throwTypeError('directory', 'string', typeof directory)
  }

  return async function (request, response, next) {
    // @todo
    next()
  }
}
