var Hapi  = require('hapi');
var async = require('async');
var Chat  = require('./../../db/models/chat.js');

exports = module.exports = update;

/// update Chat

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
    Chat.findById(ChatId, gotChat);

    function gotChat(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        if (result[0].id)            { chat.id        = result[0].id; }
        if (result[0].name)          { chat.name      = result[0].name; }
        if (result[0].members)       { chat.members   = result[0].members; }
        if (result[0].messages)      { chat.messages  = result[0].messages; }
        cb();
      }
      else {
        cb(Hapi.error.conflict('No chat with the ID: ' + chatId));
      }
    }
  }

  function updateChat(cb) {
    //console.log(request.payload.members, chat.members, request.payload.member != chat.member)

    if (request.payload.id != chat.id)              { diffChat.id        = request.payload.id; }
    if (request.payload.name != chat.name)          { diffChat.name      = request.payload.name; }
    if (request.payload.member != chat.members)     { diffChat.member    = request.payload.member; }
    if (request.payload.messages != chat.messages)  { diffChat.messages  = request.payload.messages; }
    
    diffChat.updated = Date.now();

    console.log("DIFF", diffChat)

    cb();
  }

  function saveChat(cb) {
    var query = {
      id: chat.id
    };
    if(diffChat.id) {
      query = chat;
    }
    Chat.update(query, diffChat, {}, function (err, numAffected){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      }

      console.log("UPDATED", numAffected)
      cb();
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      reply({message:'Chat Updated!'});
    }
  }
}