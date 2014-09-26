var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');
var log = require('../../helpers/logger');

exports = module.exports = update;

function update(request, reply) {

  var chatId = request.params.id;
  var chat = {};
  var diffChat = {};

  async.series([
      getChat,
      updateChat,
      saveChat,
    ], done);

  function getChat(cb) {
    Chat.findById(chatId, gotChat);

    function gotChat(err, result) {
      if (err) {
        log.error({err: err, username: request.auth.credentials.id}, '[chat] error getting chat: ' + request.params.id);
        cb(err);
      }
      if (result.length > 0) {
        chat = result[0];
        cb();
      }
      else {
        log.error({err: err, username: request.auth.credentials.id}, '[chat] no chat with id: ' + request.params.id);
        cb(Hapi.error.conflict('No chat with the ID: ' + chatId));
      }
    }
  }

  function updateChat(cb) {

    if (request.payload.message){
      diffChat.$push = {messages: request.payload.message}; 
    }
    else{
      if (request.payload.id != chat.id)              { diffChat.id        = request.payload.id; }
      if (request.payload.name != chat.name)          { diffChat.name      = request.payload.name; }
      if (request.payload.member != chat.members)     { diffChat.member    = request.payload.member; }
      if (request.payload.messages != chat.messages)  { diffChat.messages  = request.payload.messages; }
    }
    
    diffChat.date = Date.now();

    cb();
  }

  function saveChat(cb) {
    var query = { _id: chat._id };
    Chat.update(query, diffChat, {}, function (err, numAffected){
      if (err) {
        log.error({err: err, username: request.auth.credentials.id}, '[chat] error updating chat: ' + request.params.id);
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      }
      cb();
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[chat] error updating chat: ' + request.params.id);
      reply({error:"There was an error!"});
    } else {
      reply({message:'Chat Updated!'});
    }
  }
}