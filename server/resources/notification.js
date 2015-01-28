var Boom = require('boom');
var async = require('async');
var server = require('server').hapi;
var IO = require('server').socket.client;
var events = require('server/sockets').notification.events;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var parser = require('server/helpers/fieldsParser');
var Notification = require('server/db/notification');
var Member = require('server/db/member');
var Access = require('server/db/access');
var Subscription = require('server/db/subscription');


server.method('notification.notifyCreate', notifyCreate, {});
server.method('notification.notifyUpdate', notifyUpdate, {});
server.method('notification.notifyMention', notifyMention, {});
server.method('notification.notifyComment', notifyComment, {});
server.method('notification.notifyCommunication', notifyCommunication, {});
server.method('notification.notify', notify, {});
server.method('notification.broadcast', broadcast, {});
server.method('notification.create', create, {});
server.method('notification.get', get, {});
server.method('notification.getUnreadCount', getUnreadCount, {});
server.method('notification.getByMember', getByMember, {});
server.method('notification.list', list, {});
server.method('notification.remove', remove, {});
server.method('notification.decorateWithUnreadStatus', decorateWithUnreadStatus, {});
server.method('notification.getByThread', getByThread, {});
server.method('notification.removeByThread', removeByThread, {});
server.method('notification.removeBySource', removeBySource, {});

function broadcast(notification, cb){
  if(!notification){
    return cb();
  }
  IO.emit(events.notify, notification, function(err){
    if(err){
      log.error({err: err, notification: notification}, 'notification broadcast failed');
    }
  });
  cb();
}

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

function notifyMention(memberId, thread, targets, source, cb) {
  var index = targets.indexOf(memberId);
  if(index !== -1){
    targets.splice(index, 1);
    if(!targets.length){
      return cb();
    }
  }
  
  var notification = {
    thread: thread,
    member: memberId,
    description: 'mentioned you',
    targets: targets,
    source: source,
    posted: Date.now()
  };

  create(notification, cb);
}

function notifyComment(memberId, thread, source, cb) {
  var notification = {
    thread: thread,
    member: memberId,
    description: 'posted a new comment',
    source: source,
    posted: Date.now()
  };

  create(notification, cb);
}

function notifyCommunication(memberId, thread, source, cb) {
  var notification = {
    thread: thread,
    member: memberId,
    description: 'posted a new communication',
    source: source,
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
    _notification.set('unread', true, { strict: false });
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
  var filter = {thread: thread, targets: []};
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
      var filter = {id: memberId};
      var memberFields = {unreadAccess: true};
      Member.findOne(filter, memberFields, function(err, member){
        if (err) {
          log.error({ err: err, member: member}, 'error getting member notification accesses');
          return cbAsync(Boom.internal());
        }

        cbAsync(null, subscriptions, member.unreadAccess);
      });
    },
    function getUnreadNotifications(subscriptions, access, cbAsync){
      var filter = {$or: [{targets: {$in: [memberId]}}], posted: {$gt: access}};
      if(subscriptions.length){
        filter.$or.push({thread: {$in: subscriptions}});
      }
      Notification.count(filter, function(err, count){
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
    cb(null, result);
  });
}

function getByMember(memberId, query, cb) {
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
      var fields = {thread: true};
      var result = [];
      Subscription.find(filter, fields, function(err, subscriptions) {
        if (err) {
          log.error({ err: err, subscriptions: subscriptions}, 'error getting subscriptions');
          return cbAsync(Boom.internal());
        }
        for(var i = 0; i < subscriptions.length; i++){
          result.push(subscriptions[i].thread);
        }
        cbAsync(null, result);
      });
    },
    function getNotificationsFromSubscriptions(subscriptions, cbAsync){
      var filter = {$or: [{targets: {$in: [memberId]}}], member: {$ne: memberId}};
      if(subscriptions.length){
        filter.$or.push({thread: {$in: subscriptions}});
      }
      Notification.find(filter, fields, options, function(err, notifications){
        if (err) {
          log.error({ err: err, filter: filter}, 'error getting notifications');
          return cbAsync(Boom.internal());
        }

        cbAsync(null, notifications);
      });
    }
  ], function done (err, result){
    if(err){
      log.error({ err: err}, 'error counting notifications');
      return cb(err);
    }
    cb(null, result);
  });
}


function list(query, cb) {
  cb = cb || query; // fields is optional

  var filter = {targets: {$size: 0}};
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

function decorateWithUnreadStatus(memberId, collection, cb) {
  var threads = collection.map(function(o) {
    return o.thread;
  });

  var filter = { member: memberId, thread: { $in: threads }};
  Access.find(filter, function (err, accesses) {
    if (err) {
      log.error({ err: err, access: filter});
      return cb(Boom.internal());
    }

    var accessLookup = {};
    for (var i = 0, len = accesses.length; i < len; i++) {
      accessLookup[accesses[i].thread] = accesses[i];
    }

    var accessedThreads = accesses.map(function(o) {
      return o.thread;
    });


    async.map(collection, function (o, asyncCb) {
      if(accessedThreads.indexOf(o.thread) == -1) {
        o.set('unread', true, { strict: false });
        return asyncCb(null,  o);
      }

      var notificationFilter = {thread: o.thread, posted: {$gt: accessLookup[o.thread].last}};
      Notification.count(notificationFilter, function(err, count){
        if (err) {
          log.error({ err: err, count: count}, 'error counting notifications');
          return asyncCb();
        }

        o.set('unread', count > 0, { strict: false });
        asyncCb(null,  o);
      });
    }, function (err, result) {

      cb(err, result);
    });
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
      log.error({ err: err, thread: thread}, 'error removing notifications');
      return cb(Boom.internal());
    }

    cb(null);
  });
}

function removeBySource(source, cb) {
  var filter = { source: source };
  Notification.remove(filter, function(err, notifications) {
    if (err) {
      log.error({ err: err, source: source}, 'error removing notifications');
      return cb(Boom.internal());
    }

    cb(null);
  });
}

