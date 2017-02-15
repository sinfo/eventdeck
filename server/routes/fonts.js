const server = require('../index').hapi

const fonts = {
  method: 'GET',
  path: '/fonts/{path*}',
  handler: {
    directory: {
      path: './public/fonts/',
      listing: true,
      index: true
    }

  }
}

server.route(fonts)
