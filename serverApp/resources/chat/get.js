var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');

exports = module.exports = get;

function get(request, reply) {
  Chat.findById(request.params.id, function(err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply("There was an error.");
    }
  });
}
