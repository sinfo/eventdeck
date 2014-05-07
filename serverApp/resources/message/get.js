var Hapi           = require('hapi');
var async          = require('async');
var Message        = require('./../../db/models/message.js');

exports = module.exports = get;

/// get Company

function get(request, reply) {

  var messageId = request.params.id;
  var message   = {};

  async.series([
      getMessage,
    ], done);

  function getMessage(cb) {
    Message.findById(messageId, gotMessage);

    function gotMessage(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        if (result[0].id)            { message.id            = result[0].id; }
        if (result[0].chatId)        { message.chatId        = result[0].chatId; }
        if (result[0].member)        { message.member        = result[0].member; }
        if (result[0].text)          { message.text          = result[0].text; }
        if (result[0].date)          { message.date          = result[0].date; }
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
