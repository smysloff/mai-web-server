
// file: src/MaiWebServer.mjs

import http from 'node:http'

import GlobalMiddlewareManager from './GlobalMiddlewareManager.mjs'
import RoutesMiddlewareManager from './RoutesMiddlewareManager.mjs'

export default class MaiWebServer {

  constructor() {

    this.server = new http.Server()
    this.global = new GlobalMiddlewareManager()
    this.routes = new RoutesMiddlewareManager()

    const findOwner = (target, prop) => {
      if (prop in target.global) return target.global
      if (prop in target.routes) return target.routes
      return target
    }

    return new Proxy(this, {

      has: (target, prop) => {
        return prop in target.global
            || prop in target.routes
            || prop in target
      },

      get: (target, prop) => {
        const owner = findOwner(target, prop)
        const value = owner[prop]
        return typeof value === 'function'
          ? value.bind(owner)
          : value
      },

      set: (target, prop, value) => {
        const owner = findOwner(target, prop)
        owner[prop] = value
        return true
      },

    })
  }

  listen(port, ...options) {

    this.server.on('request', async (request, response) => {
      request.app = response.app = this
      await this.global.process(request, response)
      await this.routes.process(request, response)
    })

    this.server.listen(port, ...options)
  }

}

