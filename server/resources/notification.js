var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var Notification = require('server/db/models/notification');


server.method('notification.notify', notify, {});
server.method('notification.create', create, {});
server.method('notification.get', get, {});
server.method('notification.list', list, {});
server.method('notification.remove', remove, {});
server.method('notification.readThread', readThread, {});
server.method('notification.getByThread', getByThread, {});
server.method('notification.removeByThread', removeByThread, {});


function notify(memberId, thread, description, objectId, cb) {
  server.methods.member.list('id', function gotMembers(err, _members) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error creating notification');
      return cb(Boom.internal());
    }

    var members = [];
    for(var m in result) {
      if(_members[m].id != memberId){
        members.push(_members[m].id);
      }
    }

    server.methods.member.getSubscribers(thread, function gotSubscribers(err, subscribers) {
      if (err) {
        log.error({ err: err, thread: thread}, 'error creating notification');
        return cb(Boom.internal());
      }

      var notification = {
        thread: thread,
        source: objectId,
        member: memberId,
        description: description,
        unread: members,
        targets: subscribers,
        posted: new Date()
      };

      create(notification, cb);
    });
  });
}

function create(notification, cb) {
  Notification.create(notification, function(err, _notification) {
    if (err) {
      log.error({ err: err, notification: notification}, 'error creating notification');
      return cb(Boom.internal());
    }

    cb(null, _notification);
  });
}

function get(id, cb) {
  var filter = {_id: id};
  Notification.findOne(filter, function(err, notification) {
    if (err) {
      log.error({ err: err, notification: id}, 'error getting notification');
      return cb(Boom.internal());
    }
    if (!notification) {
      log.warn({ err: 'not found', notification: id}, 'error getting notification');
      return cb(Boom.notFound());
    }

    cb(null, notification);
  });
}

function getByThread(path, id, cb) {
  var thread = threadFromPath(path, id);
  var filter ={thread:thread};
  Notification.find(filter, function(err, notifications) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting notifications');
      return cb(Boom.internal());
    }

    cb(null, notifications);
  });
}

function readThread(path, id, memberId, cb) {
  var thread = threadFromPath(path, id);
  var filter = {thread:thread}; 
  Notification.update(filter, { $pull: { unread: memberId } }, function(err) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error reading notifications');
      return cb(Boom.internal());
    }

    cb();
  });
}

function list(cb) {
  Notification.find({}, function(err, notifications) {
    if (err) {
      log.error({ err: err}, 'error getting all notifications');
      return cb(Boom.internal());
    }
    
    cb(null, notifications);
  });
}

function remove(id, cb) {
  var filter ={id:id};
  Notification.findOneAndRemove(filter, function(err, notification){
    if (err) {
      log.error({ err: err, notification: id}, 'error deleting notification');
      return cb(Boom.internal());
    }
    if (!notification) {
      log.error({ err: err, notification: id}, 'error deleting notification');
      return cb(Boom.notFound());
    }

    return cb(null, notification);
  });
}

function removeByThread(path, id, cb) {
  var thread = threadFromPath(path, id);
  var fitler = {thread: thread};
  Notification.remove(filter, function(err, notifications) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting notifications');
      return cb(Boom.internal());
    }

    cb(null, notifications);
  });
}

