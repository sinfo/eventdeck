const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Subscription = require('../db/subscription')
const Member = require('../db/member')

server.method('subscription.create', create, {})
server.method('subscription.createForCoordinators', createForCoordinators, {})
server.method('subscription.get', get, {})
server.method('subscription.getByMember', getByMember, {})
server.method('subscription.getByThread', getByThread, {})
server.method('subscription.remove', remove, {})

function create (thread, memberId, cb) {
  const subscription = { thread: thread, member: memberId }

  Subscription.create(subscription, (err, _subscription) => {
    if (err) {
      log.error({err, subscription}, 'error creating subscription')
      return cb(Boom.internal())
    }

    cb(null, _subscription)
  })
}

// TODO creating for every coordinator WRONG
function createForCoordinators (thread, cb) {
  Member.find({
    participations: {
      $elemMatch: {
        role: 'coordination'
      }
    }
  }, (err, coordinators) => {
    if (err) {
      log.error({err, thread}, 'error finding coordinators while creating subscriptions')
      return cb(Boom.internal())
    }

    let subscriptions = []

    coordinators.forEach((coordinator) => {
      const subscription = {
        thread,
        member: coordinator.id
      }

      Subscription.create(subscription, (err, _subscription) => {
        if (err) {
          log.error({err, subscription}, 'error creating subscription')
          return cb(Boom.internal())
        }

        subscriptions.push(_subscription)
      })
    })

    cb(null, subscriptions)
  })
}

function get (thread, memberId, query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)
  const filter = { member: memberId, thread: thread }

  Subscription.findOne(filter, fields, function (err, subscription) {
    if (err) {
      log.error({err: err, subscription: filter}, 'error getting subscription')
      return cb(Boom.internal())
    }

    cb(null, subscription)
  })
}

function remove (thread, memberId, cb) {
  const filter = { thread: thread, member: memberId }

  Subscription.findOneAndRemove(filter, function (err, subscription) {
    if (err) {
      log.error({err: err, subscription: filter}, 'error deleting subscription')
      return cb(Boom.internal())
    }
    if (!subscription) {
      log.error({err: 'not found', subscription: filter}, 'error deleting subscription')
      return cb(Boom.notFound('member was not subscribed to this thread'))
    }

    return cb(null, subscription)
  })
}

function getByMember (memberId, query, cb) {
  cb = cb || query
  const filter = {members: {$in: [memberId]}}
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Subscription.find(filter, fields, options, function (err, subscriptions) {
    if (err) {
      log.error({err: err, subscriptions: filter}, 'error getting subscriptions')
      return cb(Boom.internal())
    }

    cb(null, subscriptions)
  })
}

function getByThread (thread, query, cb) {
  cb = cb || query
  const filter = {thread: thread}
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Subscription.find(filter, fields, options, function (err, subscriptions) {
    if (err) {
      log.error({err: err, subscriptions: filter}, 'error getting subscriptions')
      return cb(Boom.internal())
    }

    cb(null, subscriptions)
  })
}
