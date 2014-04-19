var server  = require('./../index.js');
var auth     = require('./../resources/auth');

server.route({ 
  method: 'GET', 
  path: '/redirect', 
  config: { 
    handler: auth.redirect, 
    auth: { 
      mode: 'try' 
    } 
  } 
});
    
server.route({ 
  method: 'GET', 
  path: '/login', 
  config: { 
    handler: auth.login, 
    auth: { 
      mode: 'try' 
    } 
  } 
});
    
server.route({ 
  method: 'GET', 
  path: '/logout', 
  config: { 
    handler: auth.logout, 
    auth: true 
  } 
});








