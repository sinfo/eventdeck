var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Subscription = require('server/db/subscription');
var Member = require('server/db/member');


server.method('subscription.create', create, {});
server.method('subscription.createForCoordinators', createForCoordinators, {});
server.method('subscription.get', get, {});
server.method('subscription.getByMember', getByMember, {});
server.method('subscription.getByThread', getByThread, {});
server.method('subscription.remove', remove, {});


function create(thread, memberId, cb) {
  var subscription = { thread: thread, member: memberId };

  Subscription.create(subscription, function(err, _subscription) {
    if (err) {
      log.error({ err: err, subscription: subscription}, 'error creating subscription');
      return cb(Boom.internal());
    }

    cb(null, _subscription);
  });
}

function createForCoordinators(thread, cb) {
  Member.find({
    roles: {
      $elemMatch: {
        id: 'coordination'
      }
    }
  }, function (err, coordinators) {
    if (err) {
      log.error({err: err, thread: thread}, 'error finding coordinators while creating subscriptions');
      return cb(Boom.internal());
    }

    var subscriptions = [];

    coordinators.forEach(function (coordinator) {
      var subscription = {
        thread: thread,
        member: coordinator.id
      };

      Subscription.create(subscription, function (err, _subscription) {
        if (err) {
          log.error({err: err, subscription: subscription}, 'error creating subscription');
          return cb(Boom.internal());
        }

        subscriptions.push(_subscription);
      });
    });

    cb(null, subscriptions);
  });
}

function get(thread, memberId,query, cb) {
  cb = cb || query; // fields is optional

  var fields = parser(query.fields);
  var filter = { member: memberId, thread: thread };

  Subscription.findOne(filter,fields, function(err, subscription) {
    if (err) {
      log.error({ err: err, subscription: filter}, 'error getting subscription');
      return cb(Boom.internal());
    }

    cb(null, subscription);
  });
}

function remove(thread, memberId, cb) {
  var filter = { thread: thread, member: memberId };

  Subscription.findOneAndRemove(filter, function(err, subscription){
    if (err) {
      log.error({ err: err, subscription: filter}, 'error deleting subscription');
      return cb(Boom.internal());
    }
    if (!subscription) {
      log.error({ err: 'not found', subscription: filter}, 'error deleting subscription');
      return cb(Boom.notFound('member was not subscribed to this thread'));
    }

    return cb(null, subscription);
  });
}

function getByMember(memberId, query, cb) {
  cb = cb || query;
  var filter = {members: {$in: [memberId]}};
  var fields = query.fields;
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Subscription.find(filter, fields, options, function(err, subscriptions) {
    if (err) {
      log.error({ err: err, subscriptions: filter}, 'error getting subscriptions');
      return cb(Boom.internal());
    }

    cb(null, subscriptions);
  });
}

function getByThread(thread,query, cb) {
  cb = cb || query;
  var filter = {thread: thread};
  var fields = query.fields;
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Subscription.find(filter, fields, options, function(err, subscriptions) {
    if (err) {
      log.error({ err: err, subscriptions: filter}, 'error getting subscriptions');
      return cb(Boom.internal());
    }

    cb(null, subscriptions);
  });
}

