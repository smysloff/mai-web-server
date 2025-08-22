
// file: src/RoutesMiddlewareManager.mjs

import HttpRoute from './HttpRoute.mjs'
import CoreMiddlewares from './CoreMiddlewares.mjs'

export default class RoutesMiddlewareManager {

  #stack = new Map()

  #getRoute(path) {
    if (!this.#stack.has(path)) {
      this.#stack.set(path, new HttpRoute(path))
    }
    return this.#stack.get(path)
  }

  #matchRoute(path) {
    const routes = []
    for (const route of this.#stack.values()) {
      const matchRouteResponse = route.match(path)
      if (matchRouteResponse.matched) {
        return matchRouteResponse
      }
    }
    return null
  }

  #addMiddlewares(method, pathOrMiddleware, ...middlewares) {

    typeof pathOrMiddleware === 'string'

      ? this.#getRoute(pathOrMiddleware)
            .addMiddlewares(method, ...middlewares)

      : this.#getRoute(method, '/')
            .addMiddlewares(
              method, pathOrMiddleware, ...middlewares)

    return this
  }

  all(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares('all', pathOrMiddleware, ...middlewares)
  }

  get(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares('get', pathOrMiddleware, ...middlewares)
  }

  post(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares('post', pathOrMiddleware, ...middlewares)
  }

  put(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares('put', pathOrMiddleware, ...middlewares)
  }

  delete(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares('delete', pathOrMiddleware, ...middlewares)
  }

  async process(request, response) {

    const method = request.method.toLowerCase()
    const { path } = request
    const matchedMiddlewares = []
    const emptyRoute = { route: new HttpRoute(), params: {} }

    const { route, params } = this.#matchRoute(path) || emptyRoute

    matchedMiddlewares.push(...route.getMiddlewares('all'))
    if (method !== 'all') {
      matchedMiddlewares.push(...route.getMiddlewares(method))
    }
    matchedMiddlewares.push(CoreMiddlewares.defaultError404)

    request.params = params

    let index = 0

    const next = async () => {
      if (index >= matchedMiddlewares.length) return
      const middleware = matchedMiddlewares[index++]
      await middleware(request, response, next)
    }

    await next()
  }

}
