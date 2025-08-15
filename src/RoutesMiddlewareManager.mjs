
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

}

export default class RoutesMiddlewareManager {

  constructor() {
    this.stack = new Map()
  }

  getRoute(method, path) {
    if (!this.stack.has(path)) {
      this.stack.set(path, new HttpRoute())
    }
    return this.stack.get(path)
  }

  addMiddlewares(method, pathOrMiddleware, ...middlewares) {
    if (typeof pathOrMiddleware === 'string') {
      this.getRoute(method, pathOrMiddleware)
          .addMiddlewares(...middlewares)
    } else {
      this.getRoute(method, '*')
          .addMiddlewares(pathOrMiddleware, ...middlewares)
    }
    return this
  }

  all(pathOrMiddleware, ...middlewares) {
    this.addMiddlewares('all', pathOrMiddleware, ...middlewares)
  }

  get(path, ...middlewares) {
    this.addMiddlewares('get', pathOrMiddleware, ...middlewares)
  }

  post(path, ...middlewares) {
    this.addMiddlewares('post', pathOrMiddleware, ...middlewares)
  }

  put(path, ...middlewares) {
    this.addMiddlewares('put', pathOrMiddleware, ...middlewares)
  }

  delete(path, ...middlewares) {
    this.addMiddlewares('delete', pathOrMiddleware, ...middlewares)
  }

  async process(request, response) {
    // @todo
  }

}
