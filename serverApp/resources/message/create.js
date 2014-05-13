var Hapi     = require('hapi');
var async    = require('async');
var Message  = require('./../../db/models/message.js');

exports = module.exports = create;

function create(request, reply) {

  var message    = {};
  var id;

  async.series([
      createMessage,
      saveMessage,
    ], done);

  function createMessage(cb) {
    if (request.payload.chatId)   { message.chatId  = request.payload.chatId; }
    if (request.payload.member)   { message.member  = request.payload.member; }
    if (request.payload.text)     { message.text    = request.payload.text; }
    //message._id = DB.Types.ObjectId();
    //console.log(message._id);
    cb();
  }

  function saveMessage(cb) {
    var newMessage = new Message(message);
    id = newMessage._id;
    console.log("Create " + newMessage);
    newMessage.save(function (err, reply){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        return cb();
      } else { // same id
        return cb(Hapi.error.conflict('Message ID exists: '+request.payload._id));
      }
    });
  }

  function done(err) {
    if (err) {
      console.log(err);
      reply({error:"There was an error!"});
    } else {
      console.log("Message Updated! " + id);
      reply({message:"Message Updated!", messageId:id});
    }
  }
}
