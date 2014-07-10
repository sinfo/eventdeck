var async        = require('async');
var Member       = require('./../../db/models/member.js');
var Notification = require('./../../db/models/notification.js');
/*var webSocketCl    = require('./../../index.js').webSocket.client;*/

exports = module.exports = notify;

function notify(memberId, thread, description, objectId, subscribers) {

  var members = [];
  var targets = [];

  async.series([
    setTargets,
    getMembers,
    saveNotification
  ], done);

  function setTargets(cb) {
    targets = subscribers;

    if(!targets) {
      targets = [];
    }

    cb();
  }

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
      targets: targets,
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
      var newMessage = {
        chatId: 'geral',
        member: memberId,
        kind:   'notification',
        thread: thread,
        text:   description,
      }
/*      console.log(webSocketCl);
      webSocketCl.emit('send', {room: 'geral', message: newMessage}, function(){
        console.log("Notification sent to chat!");
      });*/
      console.log(memberId+' '+description+' on '+thread+' (objectId:'+objectId+')');
    }
  }
}
