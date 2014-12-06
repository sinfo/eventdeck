var Boom = require('boom');
var async = require('async');
var server = require('server').hapi;
var webSocket = require('server').webSocket.client;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var parser = require('server/helpers/fieldsParser');
var Notification = require('server/db/notification');
var Member = require('server/db/member');
var Access = require('server/db/access');
var Subscription = require('server/db/subscription');


server.method('notification.notifyCreate', notifyCreate, {});
server.method('notification.notifyUpdate', notifyUpdate, {});
server.method('notification.notify', notify, {});
server.method('notification.create', create, {});
server.method('notification.get', get, {});
server.method('notification.list', list, {});
server.method('notification.remove', remove, {});
server.method('notification.readThread', readThread, {});
server.method('notification.getByThread', getByThread, {});
server.method('notification.removeByThread', removeByThread, {});


function notifyCreate(memberId, path, thing, cb) {
  var notification = {
    thread: threadFromPath(path, thing.id),
    member: memberId,
    description: 'created '+thing.name || thing.kind,
    posted: Date.now()
  };

  create(notification, cb);
}

function notifyUpdate(memberId, path, thing, cb) {
  var notification = {
    thread: threadFromPath(path, thing.id),
    member: memberId,
    description: 'updated '+thing.name || thing.kind,
    posted: Date.now()
  };

  create(notification, cb);
}

function notify(memberId, thread, description, objectId, targets, cb) {
  var notification = {
    thread: thread,
    source: objectId,
    member: memberId,
    description: description,
    targets: targets,
    posted: Date.now()
  };

  create(notification, cb);
}

function create(notification, cb) {
  notification.posted = Date.now();

  Notification.create(notification, function(err, _notification) {
    if (err) {
      log.error({ err: err, notification: notification}, 'error creating notification');
      return cb(Boom.internal());
    }
    webSocket.emit(notification, function(err){
      if(err){
        log.error({ err: err, notification: notification}, 'error notifying sockets');
      }
    });
    cb(null, _notification);
  });
}

function get(id,query, cb) {
  cb = cb||query;
  var filter = {_id: id};
  var fields = query.fields;

  Notification.findOne(filter,fields, function(err, notification) {
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

function getByThread(path, id, query, cb) {
  cb = cb||query;
  var thread = threadFromPath(path, id);
  var filter ={thread:thread};
  var fields = query.fields;
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Notification.find(filter,fields,options, function(err, notifications) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting notifications');
      return cb(Boom.internal());
    }

    cb(null, notifications);
  });
}

function getUnreadCount(memberId, query, cb) {
  cb = cb||query;

  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  async.waterfall([
    function getSubscriptions(cbAsync){
      var filter = {member: memberId};
      Subscription.find(filter, function(err, subscriptions) {
        if (err) {
          log.error({ err: err, subscriptions: subscriptions}, 'error getting subscriptions');
          return cbAsync(Boom.internal());
        }

        cbAsync(null, subscriptions);
      });
    },
    function getLastAccess(subscriptions, cbAsync){
      var filter = {member: memberId};
      var memberFields = {unreadAccess: true};
      Member.find(filter, memberFields, function(err, member){
        if (err) {
          log.error({ err: err, member: member}, 'error getting member notification accesses');
          return cbAsync(Boom.internal());
        }

        cbAsync(null, subscriptions, member.unreadAccess);
      });
    },
    function getUnreadNotifications(subscriptions, access, cbAsync){
      var filter = {member: memberId, posted: {$gt: access}};
      Notification.count(filter, fields, options, function(err, count){
        if (err) {
          log.error({ err: err, count: count}, 'error counting notifications');
          return cbAsync(Boom.internal());
        }

        cbAsync(null, count);
      });
    }
  ], function done (err, result){
    if(err){
      log.error({ err: err}, 'error counting notifications');
      return cb(err);
    }
    cb(result);
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

function list(query, cb) {
  cb = cb || query; // fields is optional

  var filter = {};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Notification.find(filter,fields,options, function(err, notifications) {
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
  var thread = '';
  if(typeof(id) == 'function') {
    thread = path;
    cb = id;
  } else {
    thread = threadFromPath(path, id);
  }

  var filter = {thread: thread};
  Notification.remove(filter, function(err, notifications) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting notifications');
      return cb(Boom.internal());
    }

    cb(null);
  });
}

