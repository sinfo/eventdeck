var server  = require('./../index.js').hapi;
var member  = require('./../resources/member');
var company = require('./../resources/company');
var speaker = require('./../resources/speaker');
var topic   = require('./../resources/topic');
var message = require('./../resources/message');
var comment = require('./../resources/comment');

server.route({
  method: 'GET',
  path: '/api/myself',
  config: {
    handler: member.me,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/member',
  config: {
    handler: member.list,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/member',
  config: {
    handler: member.create,
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

server.route({
  method: 'PUT',
  path: '/api/member/{id}',
  config: {
    handler: member.update,
    auth: true
  }
});

server.route({
  method: 'DELETE',
  path: '/api/member/{id}',
  config: {
    handler: member.delete,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/companies',
  config: {
    handler: company.getByMember,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/speakers',
  config: {
    handler: speaker.getByMember,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/topics',
  config: {
    handler: topic.getByMember,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/comments',
  config: {
    handler: comment.getByMember,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/member/{id}/messages',
  config: {
    handler: message.getByMember,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/role',
  config: {
    handler: member.roles,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/role/{id}/members',
  config: {
    handler: member.getByRole,
    auth: true
  }
});

