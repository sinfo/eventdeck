var async   = require('async');
var Chat    = require('./../db/models/chat');
var Member  = require('./../db/models/member');
var chats   = require('./chats')
require('./../db');

setTimeout(function() {

  var newChat = {};
  async.each(chats, function(jsonChat, callback){
    createChat(jsonChat, callback);

  }, function(error) {

    if(error) { console.log("Error!!", error); }
    console.log("DONE");
  });

  function createChat(jsonChat, cb){
    Chat.findByName(jsonChat.name, function(err, result) {
      if (err) { cb(err); }

      if (result.length == 0) {
        console.log("missing", jsonChat.name);
        newChat = {};
        newChat.id       = jsonChat.id;
        newChat.name     = jsonChat.name;
        newChat.messages = jsonChat.messages;
        newChat.members  = [];
        console.log(jsonChat.members);
        if(!jsonChat.members){
          Member.findAll(function(err, members){
            if (err) { cb(err); }
            for(var i= 0; i < members.length; i++){
              newChat.members[i] = members[i].id;
            }
          });
        }
        else{
          newChat.members  = jsonChat.members;
        }
        saveChat(cb);
      }
      else{
        cb();
      }
    });
  }

  function saveChat(cb){
    console.log(newChat);
    var chat = new Chat(newChat);

    chat.save(function (err, reply){
      if (err) {
        console.log("ERROR",('Hipcup on the DB' + err.detail));
      } else if(reply) {
        console.log("SUCCESS", newChat);
      } else { // same id        
        console.log("ERROR",('Company ID exists: '+request.payload.id));
      }
      cb();
    });
  }
}, 3000);

  

