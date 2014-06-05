var async        = require('async');
var Member       = require('./../../db/models/member.js');
var Notification = require('./../../db/models/notification.js');
var webSocket    = require('./../index.js').webSocket;

exports = module.exports = notify;

function notify(memberId, thread, description, objectId) {

  var members = [];
  async.series([
    getMembers,
    saveNotification
  ], done);

  function getMembers(cb) {
    Member.findAll(gotMembers);

    function gotMembers(err, result) {
      if (err)
        return cb(err);

      for(var member in result) {
        if(result[member].id != memberId){
          members.push(result[member].id);
        }
      }
      cb();
    }
  }

  function saveNotification(cb) {
    var newNotification = new Notification({
      thread: thread,
      source: objectId,
      member: memberId,
      description: description,
      unread: members,
      posted: Date.now()
    });

    newNotification.save(function (err, reply){
      if (err) {
        cb('Hipcup on the DB' + err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      console.log("There was an error! "+ err);
    } else {
      var newMessage {
        chatId: 'geral',
        member: memberId,
        kind:   'notification',
        source: objectId,
        text:   description,
      }
      webSocket.of('/chat').in('geral').emit('message', newMessage);
      console.log(memberId+' '+description+' on '+thread+' (objectId:'+objectId+')');
    }
  }
}
