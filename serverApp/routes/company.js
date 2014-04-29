var server  = require('./../index.js');
var company = require('./../resources/company');
var comment = require('./../resources/comment');

server.route({ 
  method: 'GET', 
  path: '/api/company', 
  config: { 
    handler: company.list, 
    auth: true 
  } 
});

server.route({ 
  method: 'POST', 
  path: '/api/company', 
  config: { 
    handler: company.create, 
    auth: true 
  } 
});

server.route({ 
  method: 'GET', 
  path: '/api/company/{id}', 
  config: { 
    handler: company.get, 
    auth: true 
  } 
});

server.route({ 
  method: 'PUT', 
  path: '/api/company/{id}', 
  config: { 
    handler: company.update, 
    auth: true 
  } 
});

server.route({ 
  method: 'GET', 
  path: '/api/company/{id}/comments', 
  config: { 
    handler: comment.getByThread, 
    auth: true 
  } 
});

server.route({ 
  method: 'POST', 
  path: '/api/company/{id}/sendInitialEmail', 
  config: { 
    handler: company.sendInitialEmail, 
    auth: true 
  } 
});

