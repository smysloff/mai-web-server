
// file: src/CoreMiddlewares.mjs

export default class CoreMiddlewares {

  static async updateRequest(request, response, next) {
    request.hostname = request.host?.split(':')?.at(0)
    request.path = request.url?.split('?')?.at(0)
    await next()
  }

  static async updateResponse(request, response, next) {

    await next()
  }

}
