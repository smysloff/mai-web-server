
// file: index.mjs

import MaiWebServer from './src/MaiWebServer.mjs'

const app = new MaiWebServer()
const port = 8081

app.listen(port,
  () => console.log(`server starts on port: ${port}`))

async function logger(request, response, next) {
  const { path } = request
  const { statusCode } = response
  console.log(`server: ${path} ${statusCode}`)
  await next()
}

async function homePage(request, response) {
  response.send('<h1>Welcome to MaiWebServer!</h1>')
}

async function jsonTestPage(request, response) {
  const data = { JavaScript: 'Sucks!' }
  response.send(data)
}

app.get('/', logger, homePage)
app.get('/js', logger, jsonTestPage)


