var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');
var log = require('../../helpers/logger');

exports = module.exports = list;

function list(request, reply) {
  Chat.findAll(function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      log.error({err: err, username: request.auth.credentials.id}, '[chat] error getting chats');
      reply("There was an error getting all chats.");
    }
  });
}
