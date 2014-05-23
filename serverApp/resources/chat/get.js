var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');

exports = module.exports = get;

function get(request, reply) {

  if (request.params.id) {
    Chat.findById(request.params.id, function(err, result) {
      if (!err && result && result.length > 0) {
        reply(result[0]);
      }
      else {
        reply("There was an error.");
      }
    });
  }
  else {
    Chat.findAll(function(err, result) {
      if (!err && result && result.length > 0) {
        reply(result);
      }
      else {
        reply("There was an error getting all chats.");
      }
    });
  }
}
