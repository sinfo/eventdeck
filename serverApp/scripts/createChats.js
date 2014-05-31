var async   = require('async');
var Chat    = require('./../db/models/chat');
var Member  = require('./../db/models/member');
var chats   = require('./chats')
require('./../db');

setTimeout(function() {

  var newChat = {};
  var members = [];
  Member.findAll(function(err, result){
    if (err) { cb(err); }
    for(var i= 0; i < members.length; i++){
      members[i] = result[i].id;
    }
    async.each(chats, function(jsonChat, callback){
      createChat(jsonChat, callback);
    }, 
    function(error) {
      if(error) { console.log("Error!!", error); }
      console.log("DONE");
    });
  });

  function createChat(jsonChat, cb){
    Chat.findById(jsonChat.id, function(err, result) {
      if (err) { cb(err); }
      if (!result) {
        console.log("missing", jsonChat.name);
        newChat = jsonChat;
        if(!jsonChat.members){
          console.log(members);
          newChat.members  = members;
        }
        else{
          newChat.members  = jsonChat.members;
          saveChat(cb);
        }
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

  

