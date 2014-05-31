var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');

exports = module.exports = get;

function get(request, reply) {
  Chat.findAll(function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply("There was an error getting all chats.");
    }
  });
}
