
// file: src/GlobalMiddlewareManager.mjs

import CoreMiddlewares from './CoreMiddlewares.mjs'

export default class GlobalMiddlewareManager {

  constructor() {
    this.#stack = new Map()
  }

  use(prefixOrMiddleware, ...middlewares) {

    if (
      typeof prefixOrMiddleware !== 'string'
      && typeof prefixOrMiddleware !== 'function'
    ) {
      throw new TypeError(
        `Invalid argument: 'prefixOrMiddleware' must be a string (route path) or a function (middleware), but received type '${typeof prefixOrMiddleware}'.`
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
      if (!this.#stack.has(prefix)) {
        this.#stack.set(prefix, [])
      }
      return this.#stack.get(prefix)
    }

    if (typeof prefixOrMiddleware === 'function') {
      const route = getRoute('/')
      route.push(prefixOrMiddleware, ...middlewares)
    } else {
      const route = getRoute(prefixOrMiddleware)
      route.push(...middlewares)
    }

  }

  async process(request, response) {

    await CoreMiddlewares.updateRequest(
      request, response, async () => {})

    await CoreMiddlewares.updateResponse(
      request, response, async () => {})

    const matchedMiddlewares = []
    const { path } = request

    for (
      const [fileprefix, middlewares] of this.#stack.entries()
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

