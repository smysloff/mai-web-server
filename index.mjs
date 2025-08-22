
// file: index.mjs

import MaiWebServer from './src/MaiWebServer.mjs'

const app = new MaiWebServer()
const port = 8081

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

async function blogPostPage(request, response) {
  const { param } = request
  console.log(param)
  response.send('blogPostPage')
}

async function api1page(request, response) {
  const { param } = request
  console.log(param)
  response.send('api1page')
}

async function api2page(request, response) {
  const { param } = request
  console.log(param)
  response.send('api2page')
}

async function api3page(request, response) {
  const { param } = request
  console.log(param)
  response.send('api3page')
}

app.get('/', logger, homePage)
app.get('/js', logger, jsonTestPage)
app.get('/blog/:title([-\\w]+)', logger, blogPostPage)
app.get('/api/1?1', logger, api1page)
app.get('/api/1+2', logger, api2page)
app.get('/api/1*3', logger, api3page)

app.listen(port, () => console.log(`server starts on port: ${port}`))

