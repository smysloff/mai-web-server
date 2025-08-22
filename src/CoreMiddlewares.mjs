
// file: src/CoreMiddlewares.mjs

const MimeTypes = new Map(Object.entries({
  'bin':    'application/octet-stream',
  'css':    'text/css',
  'gif':    'image/gif',
  'htm':    'text/html',
  'html':   'text/html',
  'ico':    'image/vnd.microsoft.icon',
  'jpeg':   'image/jpeg',
  'jpg':    'image/jpeg',
  'js':     'text/javascript',
  'json':   'application/json',
  'jsonld': 'application/ld+json',
  'mjs':    'text/javascript',
  'pdf':    'application/pdf',
  'png':    'image/png',
  'svg':    'image/svg+xml',
  'txt':    'text/plain',
  // @todo
}))

function getContentType(data) {
  const type = typeof data
  if (type === 'string') {
    return data.startsWith('<')
      ? MimeTypes.get('html')
      : MimeTypes.get('txt')
  }
  if (type === 'object' && !Buffer.isBuffer(data)) {
    return MimeTypes.get('json')
  }
  return MimeTypes.get('bin')
}

export default class CoreMiddlewares {

  static async updateRequest(request, response, next) {
    request.hostname = request.host?.split(':')?.at(0)
    request.path = request.url?.split('?')?.at(0)
    await next()
  }

  static async updateResponse(request, response, next) {

    response.send = (data) => {
      if (!response.headersSent) {
        response.setHeader(
          'Content-Type',
          `${getContentType(data)}; charset=utf8`
        )
      }
      response.end(
        typeof data === 'object'
          ? JSON.stringify(data)
          : data
      )
    }

    await next()
  }

  static async defaultError404(request, response) {
    response.statusCode = 404
    response.send('<h1>Error 404: Page Not Found</h1>')
  }

}

