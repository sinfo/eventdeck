var server  = require('./../index.js');
var company = require('./../resources/company');

server.route({ 
  method: 'GET', 
  path: '/', 
  config: { 
    handler: company.list, 
    auth: true 
  } 
});

server.route({ 
  method: 'GET', 
  path: '/company/{id}', 
  config: { 
    handler: company.get, 
    auth: true 
  } 
});

server.route({ 
  method: 'GET', 
  path: '/company/{id}/go/{which}', 
  config: { 
    handler: company.get, 
    auth: true 
  } 
});