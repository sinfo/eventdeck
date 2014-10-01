var Hapi           = require('hapi');
var Message        = require('./../../db/models/message.js');
var log = require('../../helpers/logger');

exports = module.exports = get;


function get(request, reply) {

  var messageId = request.params.id;
  var message   = {};

  getMessage(done);

  function getMessage(cb) {
    Message.findById(messageId, gotMessage);

    function gotMessage(err, result) {
      if (err) {
        log.error({err: err, username: request.auth.credentials.id}, '[message] error getting message ' + request.params.id);
        cb(err);
      }

      if (result.length > 0) {
        message.id = result[0].id;
        cb();
      }
      else {
        log.error({err: err, username: request.auth.credentials.id}, '[message] no message with ID: ' + request.params.id);
        cb(Hapi.error.conflict('No message with the ID: ' + messageId));
      }
    }
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[message] error getting message' + request.params.id);
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(message);
    }
  }
}
