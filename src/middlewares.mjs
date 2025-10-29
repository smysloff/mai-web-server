
// src/middlewares.mjs

export function defaultError404(_, response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Error 404: Page Not Found')
}
