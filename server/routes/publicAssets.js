const server = require('../index').hapi

const publicAssets = {
  method: 'GET',
  path: '/static/{path*}',
  handler: {
    directory: {
      path: './public/',
      listing: true,
      index: true
    }

  }
}

server.route(publicAssets)
