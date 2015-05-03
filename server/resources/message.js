var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Message = require('server/db/message');

server.method('message.create', create, {});
server.method('message.get', get, {});
server.method('message.list', list, {});
server.method('message.getByChat', getByChat, {});

function create(message, cb) {
  Message.create(message, function(err, _message) {
    if (err) {
      log.error({ err: err, message: message}, 'error creating message');
      return cb(Boom.internal());
    }

    cb(null, _message);
  });
}

function get(id,query, cb) {
  cb = cb || query; // fields is optional

  var fields = parser(query.fields);
  var filter = {id: id};

  Message.findOne(filter, fields, function(err, message) {
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
}

function getByChat(chatId, query, cb){
  cb = cb || query;

  var filter = {chatId: chatId};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Message.find(filter, fields, options, function(err, messages) {
    if(err) {
      log.error({ err: err, chat: chatId}, 'error getting messages');
      return cb(Boom.internal());
    }
    cb(null, messages);
  });
}

function list(query, cb) {
  cb = cb || query; // fields is optional

  var filter = {};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Message.find(filter,fields,options, function(err, messages) {
    if (err) {
      log.error({ err: err}, 'error getting all messages');
      return cb(Boom.internal());
    }

    cb(null, messages);
  });
}