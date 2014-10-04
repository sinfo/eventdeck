var Message        = require('./../../db/models/message.js');
var Hapi           = require('hapi');
var log = require('../../helpers/logger');

module.exports = list;

function list(request, reply) {

  var memberId = request.params.id;
  var message;

  getMessage(done);

  function getMessage(cb) {
    Message.findByMember(memberId, gotMessage);

    function gotMessage(err, result) {
      if (err){
        log.error({err: err, username: request.auth.credentials.id}, '[message] error getting message by memberId: ' + request.params.id);
        cb(err);
      }
      message = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[message] error getting message by memberId: ' + request.params.id);
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(message);
    }
  }
}