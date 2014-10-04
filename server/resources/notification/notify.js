var async        = require('async');
var Member       = require('../../db/models/member');
var Notification = require('../../db/models/notification');
var webSocketCl  = require('../../index.js').webSocket.client;
var log = require('../../helpers/logger');

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

    Member.findSubscribers(thread, gotMembers);

    function gotMembers(err, result) {
      if (err) {
        return cb(err);
      }

      for(var member in result) {
        if(targets.indexOf(result[member].id) == -1){
          targets.push(result[member].id);
        }
      }
      cb();
    }
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

    newNotification.save(function (err){
      if (err) {
        return cb('Hipcup on the DB' + err);
      }
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      return log.error({err: err}, '[notification] error creating notification');
    } 

    var newMessage = {
      chatId: 'geral',
      member: memberId,
      kind:   'notification',
      source: thread,
      text:   description,
    };
    webSocketCl.emit('send', {room: 'geral', message: newMessage}, function(){
      log.debug('[notification] notification sent to chat');
    });
    
    log.info({ thread: thread, description: memberId+' '+description+' on '+thread+' (objectId:'+objectId+')' }, '[notification] notification created');
  }
}