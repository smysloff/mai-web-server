
// file: index.mjs

import { readFile } from 'node:fs/promises'
import { exit } from 'node:process'
import HttpServer from './src/HttpServer.mjs'
import { getReadableIP, getDateTime } from './src/utils.mjs'
import Env from './src/Env.mjs'

try {

  const env = await Env.parse('.env')
  const { port, host } = env

  if (!port) {
    throw new Error('Port is required in .env file')
  }

  const options = {}

  try {
    if (env.key) options.key = await readFile(env.key)
    if (env.cert) options.cert = await readFile(env.cert)
  } catch (error) {
    console.error(`${ getDateTime() } <SERVER>: Failed to load SSL certificates:`, error.message)
    exit(1)
  }

  if (env.uid) options.uid = env.uid
  if (env.gid) options.gid = env.gid

  const server = new HttpServer(options)

  server.use((request, response, next) => {

    const clientAddress = getReadableIP(request.socket.remoteAddress)
    const clientPort = request.socket.remotePort
    const { url, method } = request
    const client = `${ clientAddress }:${ clientPort }`

    console.log(`${ getDateTime() } <${ client }>: ${ method } ${ url }`)

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

} catch (error) {
  console.error(`${ getDateTime() } <SERVER>: Startup failed`, error.message)
  exit(1)
}

