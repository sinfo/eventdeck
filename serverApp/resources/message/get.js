var Hapi           = require('hapi');
var Message        = require('./../../db/models/message.js');

exports = module.exports = get;


function get(request, reply) {

  var messageId = request.params.id;
  var message   = {};

  getMessage(done);

  function getMessage(cb) {
    Message.findById(messageId, gotMessage);

    function gotMessage(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        message.id = result[0].id;
        cb();
      }
      else {
        cb(Hapi.error.conflict('No message with the ID: ' + messageId));
      }
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
