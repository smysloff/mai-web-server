
// file: src/HttpRoute.mjs

class MatchResponse {
  constructor(matched) {
    this.matched = matched == null
    this.params = matched?.groups
      ? Object.freeze(matched.groups)
      : {}
  }
}

export default class HttpRoute {

  #defaultParamPatternStr = '\\w+'
  #defaultParamPatternExp = /:(\w+)(\(([^)]+)\))?/gu

  #middlewares = {}

  #getRegexp(pattern) {
    // @todo add arg validation
    const regexp = pattern.replace(
      this.#defaultParamPatternExp,
      (...args) => {
        const param = args.at(1)
        const customPatternStr = args.at(3)
        const patternStr = customPatternStr || this.#defaultParamPatternStr
        return `(?<${param}>${patternStr})`
      }
    )
    return new RegExp(`^${regexp}$`, 'u')
  }

  constructor(pattern) {
    // @todo arg validation
    this.pattern = pattern
    this.regexp = this.#getRegexp(value)
  }

  match(path) {
    // @todo arg validation
    const matched = path.match(this.regexp)
    return new MatchResponse(matched)
  }

  getParams(matched) {
    // @todo arg validation
    return matched?.groups
      ? Object.freeze({ ...matched.groups })
      : {}
  }

  getMiddlewares(method) {
    // @todo arg validation
    if (!(method in this.#middlewares)) {
      this.#middlewares[method] = []
    }
    return this.#middlewares[method]
  }

  addMiddlewares(method, ...middlewares) {
    // @todo args validation
    this.getMiddlewares(method)
        .push(...middlewares)
    return this
  }

}

