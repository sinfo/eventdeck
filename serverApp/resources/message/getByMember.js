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
      if (err) cb(err);
      message = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(message);
    }
  }
}