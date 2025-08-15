
// file: src/GlobalMiddlewareManager.mjs

import CoreMiddlewares from './CoreMiddlewares.mjs'

export default class GlobalMiddlewareManager {

  constructor() {
    this.stack = new Map()
  }

  use(prefix, ...middlewares) {

    if (
      typeof prefix !== 'string'
      && typeof prefix !== 'function'
    ) {
      throw new TypeError(
        `Invalid argument: prefix must be a string (route path) or a function (middleware), but received type '${typeof prefix}'.`
      )
    }

    for (const [i, middleware] of middlewares.entries()) {
      if (typeof middleware !== 'function') {
        throw new TypeError(
          `Invalid middleware at position ${i + 1}: expected a function but received type '${typeof middleware}'.`
        )
      }
    }

    const getRoute = (prefix) => {
      if (!this.stack.has(prefix)) {
        this.stack.set(prefix, [
          CoreMiddlewares.updateRequest,
          CoreMiddlewares.updateResponse,
        ])
      }
      return this.stack.get(prefix)
    }

    if (typeof prefix === 'function') {
      const route = getRoute('/')
      route.push(prefix, ...middlewares)
    } else {
      const route = getRoute(prefix)
      route.push(...middlewares)
    }

  }

  async process(request, response) {

    const { path } = request

    const matchedMiddlewares = []

    for (
      const [fileprefix, middlewares] of this.stack.entries()
    ) {

      const dirprefix = fileprefix.endsWith('/')
        ? fileprefix
        : fileprefix + '/'

      if (path === fileprefix || path.startsWith(dirprefix)) {
        matchedMiddlewares.push(...middlewares)
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

