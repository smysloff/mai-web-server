
// file: src/RoutesMiddlewaresManager.mjs

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

export default class RoutesMiddlewaresManager {

  constructor() {
    this.stack = new Map()
  }

  getRoute(method, path) {
    if (!this.stack.has(path)) {
      this.stack.set(path, new HttpRoute())
    }
    return this.stack.get(path)
  }

  all(path, ...middlewares) {

  }

  get(path, ...middlewares) {

  }

  post(path, ...middlewares) {

  }

  put(path, ...middlewares) {

  }

  delete(path, ...middlewares) {

  }

  process(request, response) {

  }

}
