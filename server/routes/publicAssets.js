var server = require('server').hapi

var publicAssets = {
  method: 'GET',
  path: '/static/{path*}',
  config: {
    handler: {
      directory: {
        path: './public/',
        listing: true,
        index: true
      }
    }
  }
}

server.route(publicAssets)
