
// file: src/HttpRoute.mjs

export default class HttpRoute {

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

