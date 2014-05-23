var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');

exports = module.exports = get;

function get(request, reply) {

  if (request.params.id) {
    Chat.findById(request.params.id, function(result) {
      if (result && result.length > 0) {
        reply(result[0]);
      }
      else {
        reply("There was an error.");
      }
    });
  }
  else {
    Chat.findAll(function(result) {
      if (result && result.length > 0) {
        reply(result);
      }
      else {
        reply({error: "There was an error getting all chats.", result: result});
      }
    });
  }
}
