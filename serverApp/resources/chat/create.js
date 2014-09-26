var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');
var log = require('../../helpers/logger');

exports = module.exports = create;

function create(request, reply) {

  var chat = {};

  async.series([
      checkChat,
      createChat,
      saveChat,
    ], done);

  function checkChat(cb) {
    if(request.payload.id) {
      Chat.findById(request.payload.id, function(err, chat) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (chat.length > 0) {
          return cb(Hapi.error.conflict('Chat ID exists: '+request.payload.id));
        } else {
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createChat(cb) {
    chat.id   = request.payload.id;
    chat.name = request.payload.name;
    if (request.payload.members)  { chat.members     = request.payload.members; }
    if (request.payload.messages) { chat.messages    = request.payload.messages; }
    cb();
  }

  function saveChat(cb) {
    var newChat = new Chat(chat);

    newChat.save(function (err, reply){
      if (err) {
        log.error({err: err, username: request.auth.credentials.id}, '[chat] error creating chat', newChat);
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        return cb();
      } else { // same id
        log.error({err: err, username: request.auth.credentials.id}, '[chat] chat id already exists: ' + request.payload.id);
        return cb(Hapi.error.conflict('Chat ID exists: '+request.payload.id));
      }
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[chat] error creating chat', newChat);
      reply({error:"There was an error!"});
    } else {
      reply({message:"Chat Updated!"});
    }
  }
}
