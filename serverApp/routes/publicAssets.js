var server = require('./../index.js');

var cssAssets = { 
  method: 'GET', 
  path: '/css/{path*}', 
  handler: {
    directory: { 
      path: './public/css', 
      listing: true, 
      index: true 
    }
  } 
}

var jsAssets = { 
  method: 'GET', 
  path: '/js/{path*}', 
  handler: {
    directory: { 
      path: './public/js', 
      listing: true, 
      index: true 
    }
  } 
}

var inkAssets = { 
  method: 'GET', 
  path: '/ink/{path*}', 
  handler: {
    directory: { 
      path: './public/ink', 
      listing: true, 
      index: true 
    }
  } 
}

var imgAssets = { 
  method: 'GET', 
  path: '/img/{path*}', 
  handler: {
    directory: { 
      path: './public/img', 
      listing: true, 
      index: true 
    }
  } 
}

server.route(inkAssets);
server.route(cssAssets);
server.route(jsAssets);
server.route(imgAssets);