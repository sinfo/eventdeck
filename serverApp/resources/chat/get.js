var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');
var log = require('../../helpers/logger');

exports = module.exports = get;

function get(request, reply) {
  Chat.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      log.error({err: err, username: request.auth.credentials.id}, '[chat] error getting chat: ' + request.params.id);
      reply("There was an error.");
    }
  });
}
