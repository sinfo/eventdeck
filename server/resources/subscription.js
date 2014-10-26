var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var Subscription = require('server/db/models/subscription');


server.method('subscription.create', create, {});
server.method('subscription.get', get, {});
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

function get(thread, memberId, cb) {
  var filter = { member: memberId, thread: thread };

  Subscription.findOne(filter, function(err, subscription) {
    if (err) {
      log.error({ err: err, subscription: filter}, 'error getting subscription');
      return cb(Boom.internal());
    }
    if (!subscription) {
      log.warn({ err: 'not found', subscription: filter}, 'error getting subscription');
      return cb(Boom.notFound('member is not subscribed to this thread'));
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
      log.error({ err: err, subscription: filter}, 'error deleting subscription');
      return cb(Boom.notFound('member was not subscribed to this thread'));
    }

    return cb(null, subscription);
  });
}

function getByMember(memberId, cb) {
  var filter = { member: memberId };

  Subscription.find(filter, function(err, subscriptions) {
    if (err) {
      log.error({ err: err, subscriptions: filter}, 'error getting subscriptions');
      return cb(Boom.internal());
    }

    cb(null, subscriptions);
  });
}

function getByThread(thread, cb) {
  var filter = { thread: thread };

  Subscription.find(filter, function(err, subscriptions) {
    if (err) {
      log.error({ err: err, subscriptions: filter}, 'error getting subscriptions');
      return cb(Boom.internal());
    }

    cb(null, subscriptions);
  });
}

