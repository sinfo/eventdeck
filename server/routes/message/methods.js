var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var Message = require('server/db/models/message');


server.method('message.get', get, {});
server.method('message.list', list, {});


function get(id, cb) {
  Message.findOne({_id: id}, function(err, message) {
    if (err) {
      log.error({ err: err, message: id}, 'error getting message');
      return cb(Boom.internal());
    }
    if (!message) {
      log.warn({ err: 'not found', message: id}, 'error getting message');
      return cb(Boom.notFound());
    }

    cb(null, message);
  });
};

function list(cb) {
  Message.find({}, function(err, messages) {
    if (err) {
      log.error({ err: err}, 'error getting all messages');
      return cb(Boom.internal());
    }
    
    cb(null, messages);
  });
};