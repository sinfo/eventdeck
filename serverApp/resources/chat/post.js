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
    Chat.findById(chatId, gotChat);

    function gotChat(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        console.log(result[0]);
        if (result[0].id)            { chat = result[0]; }
        cb();
      }
      else {
        cb(Hapi.error.conflict('No chat with the ID: ' + chatId));
      }
    }
  }

  function updateChat(cb) {
    //console.log(request.payload.members, chat.members, request.payload.member != chat.member)
    diffChat = chat;
    console.log(request.payload.message);
    diffChat.messages.push(request.payload.message);    
    diffChat.updated = Date.now();
    console.log("DIFF", diffChat);

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