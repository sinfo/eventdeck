var Hapi   = require('hapi');
var async  = require('async');
var Chat   = require('./../../db/models/chat.js');

exports = module.exports = get;

/// get Company

function get(request, reply) {

  var chatId = request.params.id;
  var chat   = {};

  async.series([
      getChat,
    ], done);

  function getChat(cb) {
    Chat.findById(chatId, gotChat);

    function gotChat(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        if (result[0].id)            { chat.id        = result[0].id; }
        if (result[0].members)       { chat.members   = result[0].members; }
        if (result[0].messages)      { chat.messages  = result[0].messages; }
        if (result[0].date)          { chat.date      = result[0].date; }
        cb();
      }
      else {
        cb(Hapi.error.conflict('No chat with the ID: ' + chatId));
      }
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(chat);
    }
  }
}
