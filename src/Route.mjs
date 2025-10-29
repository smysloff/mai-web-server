
// file: src/Route.mjs

import Layer from './Layer.mjs'
import { isString } from './utils.mjs'

export default class Route extends Layer {

  static pathToRegexp(path) {
    const regexp = path.replaceAll(/\/:([\w-]+)/gui, '(?<$1>/[\\w-]+)')
    return new RegExp('^' + regexp + '$')
  }

  static checkMethod(method) {
    if (!isString(method)) {
      throw new TypeError(`'method' must be a 'string' type`)
    }
    return method.toUpperCase()
  }

  #path
  #method
  #params

  get method() {
    return this.#method
  }

  get params() {
    return this.#params
  }

  constructor({ method, path, handlers }) {
    super({ path, handlers })
    this.#path = this.constructor.pathToRegexp(this.path)
    this.#method = this.constructor.checkMethod(method)
  }

  match({ method, path }) {
    return this.#matchMethod(method)
        && this.#matchPath(path)
  }

  #matchMethod(method) {
    method = this.constructor.checkMethod(method)
    return this.method === method
  }

  #matchPath(path) {
    path = this.constructor.checkPath(path)
    const match = path.match(this.path)
    if (!match) return null
    this.#params = match.groups || {}
    return this.path === path
  }

}
