var Hapi     = require('hapi');
var async    = require('async');
var Message  = require('./../../db/models/message.js');

exports = module.exports = create;

function create(request, reply) {

  var message = {};

  async.series([
      checkMessage,
      createMessage,
      saveMessage,
    ], done);

  function checkMessage(cb) {
    if(request.payload.id) {
      Message.findById(request.payload.id, function(err, message) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (message.length > 0) {
          return cb(Hapi.error.conflict('Message ID exists: '+request.payload.id));
        } else {
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createMessage(cb) {
    message.id   = request.payload.id;
    if (request.payload.chatId)   { message.chatId  = request.payload.chatId; }
    if (request.payload.member)   { message.member  = request.payload.member; }
    if (request.payload.text)     { message.text    = request.payload.text; }
    cb();
  }

  function saveMessage(cb) {
    var newMessage = new Message(message);

    newMessage.save(function (err, reply){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        return cb();
      } else { // same id
        return cb(Hapi.error.conflict('Message ID exists: '+request.payload.id));
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      reply({message:"Message Updated!"});
    }
  }
}
