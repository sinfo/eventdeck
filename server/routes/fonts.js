var server = require('server').hapi

var fonts = {
  method: 'GET',
  path: '/fonts/{path*}',
  config: {
    handler: {
      directory: {
        path: './public/fonts/',
        listing: true,
        index: true
      }
    }
  }
}

server.route(fonts)
