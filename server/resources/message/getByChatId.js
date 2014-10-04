var Message        = require('./../../db/models/message.js');
var Hapi           = require('hapi');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  var chatId = request.params.id;
  var dateRef = request.params.date;
  var messages;

  getMessage(done);

  function getMessage(cb) {
    Message.findByChatId(chatId, dateRef, gotMessage);

    function gotMessage(result) {
      messages = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[message] error getting message by chatId: ' + request.params.id);
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(messages);
    }
  }
}