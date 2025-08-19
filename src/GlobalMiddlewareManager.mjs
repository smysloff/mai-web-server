
// file: src/GlobalMiddlewareManager.mjs

import CoreMiddlewares from './CoreMiddlewares.mjs'

export default class GlobalMiddlewareManager {

  #stack = new Map()

  #getRoute(prefix) {
    if (!this.#stack.has(prefix)) {
      this.#stack.set(prefix, [])
    }
    return this.#stack.get(prefix)
  }

  use(prefixOrMiddleware, ...middlewares) {

    // validate arguments

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


    // add middlewares to routes

    if (typeof prefixOrMiddleware === 'function') {
      const route = this.#getRoute('/')
      route.push(prefixOrMiddleware, ...middlewares)
    } else {
      const route = this.#getRoute(prefixOrMiddleware)
      route.push(...middlewares)
    }

  }

  async process(request, response) {

    // update HttpRequest and HttpResponse

    await CoreMiddlewares.updateRequest(
      request, response, async () => {})

    await CoreMiddlewares.updateResponse(
      request, response, async () => {})


    // find all middlewares for the path

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


    // run through all matched middlewares

    let index = 0

    const next = async () => {
      if (index >= matchedMiddlewares.length) return
      const middleware = matchedMiddlewares[index++]
      await middleware(request, response, next)
    }

    await next()
  }

}

