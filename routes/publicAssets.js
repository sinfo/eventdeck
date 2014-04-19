var server = require('./../index.js');

var publicAssets = { 
  method: 'GET', 
  path: '/{path*}', 
  handler: {
    directory: { 
      path: './public', 
      listing: true, 
      index: true 
    }
  } 
}

server.route(publicAssets);