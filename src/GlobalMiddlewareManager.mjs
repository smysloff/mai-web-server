
// file: src/GlobalMiddlewareManager.mjs

import CoreMiddlewares from './CoreMiddlewares.mjs'

export default class GlobalMiddlewareManager {

  constructor() {
    this.stack = new Map()
  }

  use(prefix, ...middlewares) {

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

    for (const [fileprefix, middlewares] of this.stack.entries()) {

      const dirprefix = fileprefix.endsWith('/')
        ? fileprefix
        : fileprefix + '/'

      if (path === fileprefix || path.startsWith(dirprefix)) {
        matchedMiddlewares.push(...middlewares)
      }

      let index = 0

      const next = async () => {
        if (index >= middlewares.length) return
        const middleware = matchedMiddlewares[index++]
        typeof middleware === 'function'
          ? await middleware(request, response, next)
          : await next()
      }

      await next()
    }
  }

}

