
// file: index.mjs

import { readFile } from 'node:fs/promises'
import HttpServer from './src/HttpServer.mjs'
import { getReadableIP, getDateTime } from './src/utils.mjs'
import Env from './src/Env.mjs'


const options = {}
const env = await Env.parse('.env')
for (const [ key, value ] of Object.entries(env)) {
  options[key] = ['key', 'cert'].includes(key)
    ? await readFile(value)
    : value
}
const { port, host } = options


const server = new HttpServer(options)

server.use((request, response, next) => {

  const addr = getReadableIP(request.socket.remoteAddress)
  const port = request.socket.remotePort
  const { url, method } = request
  const client = `${ addr }:${ port }`

  console.log(
    `${ getDateTime() } <${ client }>: ${ method } ${ url }`
  )

  next()
})

server.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello, World!')
})

server.use((request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Error 404: Page Not Found')
})

server.listen(port, host, () => {
  console.log(`${ getDateTime() } <SERVER>: start listen on port ${ server.port }`)
})

