
// file: src/RoutesMiddlewareManager.mjs

class HttpRoute {

  getMiddlewares(method) {
    if (!(method in this)) {
      this[method] = []
    }
    return this[method]
  }

  addMiddlewares(method, ...middlewares) {
    const list = this.getMiddlewares(method)
    list.push(...middlewares)
    return this
  }

  error404(request, response) {
    response.writeHead(404, {
      'content-type': 'text/html; charset=utf8'
    })
    response.end('<h1>Error 404: Page Not Found</h1>')
  }

}

export default class RoutesMiddlewareManager {

  #stack

  #getRoute(method, path) {
    if (!this.#stack.has(path)) {
      this.#stack.set(path, new HttpRoute())
    }
    return this.#stack.get(path)
  }

  #matchRoute(method, path) {
    const routes = []
    for (const [pattern, route] of this.#stack) {
      const regexp = new RegExp(pattern)
      if (regexp.test(path)) routes.push(route)
    }
    return routes
  }

  #addMiddlewares(method, pathOrMiddleware, ...middlewares) {

    typeof pathOrMiddleware === 'string'

      ? this.#getRoute(method, pathOrMiddleware)
            .addMiddlewares(...middlewares)

      : this.#getRoute(method, '*')
            .addMiddlewares(pathOrMiddleware, ...middlewares)

    return this
  }

  constructor() {
    this.#stack = new Map()
  }

  all(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares(
      'all', pathOrMiddleware, ...middlewares)
  }

  get(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares(
      'get', pathOrMiddleware, ...middlewares)
  }

  post(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares(
      'post', pathOrMiddleware, ...middlewares)
  }

  put(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares(
      'put', pathOrMiddleware, ...middlewares)
  }

  delete(pathOrMiddleware, ...middlewares) {
    this.#addMiddlewares(
      'delete', pathOrMiddleware, ...middlewares)
  }

  async process(request, response) {

    const method = request.method.toLowerCase()
    const { path } = request
    const matchedMiddlewares = []
    const routes = this.#matchRoute(path)

    if (!routes.length) return

    for (const route of routes) {
      matchedMiddlewares.push(...route.getMiddlewares('all'))
      if (method !== 'all') {
        matchedMiddlewares.push(...route.getMiddlewares(method))
      }
    }

    let index = 0

    const next = async () => {
      if (index >= matchedMiddlewares.length) return
      const middleware = matchedMiddlewares[index++]
      await middleware(request, response, next)
    }

    await next()
  }

}
