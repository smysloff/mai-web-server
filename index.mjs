
// file: index.mjs

import MaiWebServer from './src/MaiWebServer.mjs'

const logger = async (request, response, next) => {
  console.log(`${request.url} logger!`)
  await next()
}

const app = new MaiWebServer()

app.use('/', logger, (request, response) => {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf8' })
  response.end('<h1>JavaScript Sucks!</h1>')
})

app.listen(3000, () => console.log(`server starts on port: 3000`))
