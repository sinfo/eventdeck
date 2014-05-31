var async          = require('async');
var Message        = require('./../../db/models/message.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var chatId = request.params.id;
  var messages;

  getMessage(done);

  function getMessage(cb) {
    Message.findByChatId(chatId, gotMessage);

    function gotMessage(err, result) {
      if (err) cb(err);
      messages = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(messages);
    }
  }
}