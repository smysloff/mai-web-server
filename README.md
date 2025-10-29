# Mai Web Server

A lightweight, dependency-free web server inspired by Express.js, built with pure Node.js.

## Features

- 🚀 **Zero dependencies** - Built entirely with native Node.js modules
- 🛣️ **Express-like routing** - Familiar API with middleware support
- 🔒 **HTTPS/HTTP2 support** - Built-in secure server with automatic HTTP→HTTPS redirect
- ⚡ **Middleware chain** - Flexible request processing pipeline
- 📁 **Environment config** - Built-in `.env` file support
- 🎯 **Path parameters** - Route parameter parsing with regex support

## 🚧 Project Status

**Current Status:** Early Alpha (v0.x)

This project is in active development and **NOT production-ready**:

- 🔄 **API Instability**: Breaking changes may occur in any release
- 🐛 **Limited Testing**: Not all edge cases are covered
- 📋 **Missing Features**: Some planned functionality not yet implemented  
- 🔍 **Active Debugging**: Core components still being refined

**Recommended use cases:**
- Learning and experimentation
- Development environments
- Contributing to the project

**Avoid in:**
- Production deployments
- Critical systems
- Applications requiring stability

## Quick Start

### Installation

```bash
git clone https://github.com/your-username/simple-web-server
cd simple-web-server
```

### Basic Usage

```javascript
// server.mjs
import HttpServer from './src/HttpServer.mjs'

const server = new HttpServer()

// Global middleware
server.use((request, response, next) => {
  console.log(`${new Date().toISOString()} - ${ request.method } ${ request.url }`)
  next()
})

// Routes
server.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello, World!')
})

server.get('/user/:id', (request, response) => {
  const userId = request.params.id
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ user: { id: userId } }))
})

server.post('/api/data', (request, response) => {
  // Handle POST data...
  response.writeHead(201, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ status: 'created' }))
})

// 404 handler
server.use((request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Not Found')
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

## API Reference

### HttpServer

#### Constructor

```javascript
const server = new HttpServer(options)
```

##### Options:

* `cert` - SSL certificate file path (for HTTPS)
* `key` - SSL private key file path (for HTTPS)
* `uid` - User ID for privilege dropping
* `gid` - Group ID for privilege dropping

#### Methods

`use(path, ...handlers)`
* Register middleware or route handlers
* `path` can be omitted for root path middleware

`get(path, ...handlers)`
* Register GET route handlers

`post(path, ...handlers)`
* Register POST route handlers

`listen(port, [host], [callback])`
* Start the server
* Automatically handles HTTPS redirection on port 443

### Middleware

Middleware functions receive three arguments:

```javascript
function middleware(request, response, next) {
  // Process request
  next() // Call next middleware
}
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
port=3000
host=localhost
key=./certs/private-key.pem
cert=./certs/certificate.pem
uid=1000
gid=1000
```

### HTTPS Setup

```javascript
const server = new HttpServer({
  cert: './ssl/cert.pem',
  key: './ssl/key.pem'
})

server.listen(443, () => {
  console.log('HTTPS server running on port 443')
})
```

The server will automatically redirect HTTP (port 80) to HTTPS.


## Advanced Examples

### Multiple Middleware

```javascript
// Array of middleware
const authMiddleware = [
  (req, res, next) => { /* auth check */ next() },
  (req, res, next) => { /* logging */ next() }
]

server.use('/api', authMiddleware)
```

### Route Parameters

```javascript
server.get('/product/:category/:id', (request, response) => {
  const { category, id } = request.params
  response.end(`Category: ${category}, ID: ${id}`)
})
```

### Static File Server

```javascript
import { readFile } from 'node:fs/promises'

server.use('/public', async (request, response) => {
  try {
    const filePath = request.url.replace('/public', './static')
    const content = await readFile(filePath)
    response.writeHead(200)
    response.end(content)
  } catch {
    response.writeHead(404)
    response.end('File not found')
  }
})
```

## Security

* Automatic privilege dropping when running on ports < 1024
* Secure by default - no unnecessary features
* Built-in request validation and sanitization

## License

[GPL-3.0-or-later](LICENSE)

## Why Another Web Server?

This project aims to provide:

* Minimal footprint for embedded systems and microservices
* Educational value for understanding web server internals
* No dependency hell - just pure Node.js
* Express.js compatibility for easy migration
