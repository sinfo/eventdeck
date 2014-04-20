var server  = require('./../index.js');
var member = require('./../resources/member');

server.route({ 
  method: 'GET', 
  path: '/api/member', 
  config: { 
    handler: member.list, 
    auth: true 
  } 
});

server.route({ 
  method: 'GET', 
  path: '/api/member/{id}', 
  config: { 
    handler: member.get, 
    auth: true 
  } 
});
/*
server.route({ 
  method: 'PUT', 
  path: '/api/member/{id}', 
  config: { 
    handler: member.update, 
    auth: true 
  } 
});
*/