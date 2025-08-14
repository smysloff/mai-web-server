
// file: src/MaiWebServer.mjs

import http from 'node:http'

import GlobalMiddlewaresManager from './GlobalMiddlewaresManager.mjs'
import RoutesMiddlewaresManager from './RoutesMiddlewaresManager.mjs'

export default class MaiWebServer {

  constructor() {

    this.server = new http.Server()
    this.global = new GlobalMiddlewaresManager()
    this.routes = new RoutesMiddlewaresManager()

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

    this.server.on('request', (request, response) => {
      request.app = response.app = this
      this.global.process(request, response)
      this.routes.process(request, response)
    })

    this.server.listen(port, ...options)
  }

}

