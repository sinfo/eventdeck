const Boom = require('boom')
const async = require('async')
const server = require('../index').hapi
const IO = require('../index').socket.client
const events = require('../sockets').notification.events
const log = require('../helpers/logger')
const threadFromPath = require('../helpers/threadFromPath')
const parser = require('../helpers/fieldsParser')
const Notification = require('../db/notification')
const Member = require('../db/member')
const Access = require('../db/access')
const Subscription = require('../db/subscription')

server.method('notification.notifyCreate', notifyCreate, {})
server.method('notification.notifyUpdate', notifyUpdate, {})
server.method('notification.notifyMention', notifyMention, {})
server.method('notification.notifyComment', notifyComment, {})
server.method('notification.notifyCommunication', notifyCommunication, {})
server.method('notification.notify', notify, {})
server.method('notification.broadcast', broadcast, {})
server.method('notification.create', create, {})
server.method('notification.get', get, {})
server.method('notification.getUnreadCount', getUnreadCount, {})
server.method('notification.getByMember', getByMember, {})
server.method('notification.list', list, {})
server.method('notification.remove', remove, {})
server.method('notification.decorateWithUnreadStatus', decorateWithUnreadStatus, {})
server.method('notification.getByThread', getByThread, {})
server.method('notification.removeByThread', removeByThread, {})
server.method('notification.removeBySource', removeBySource, {})

function broadcast (notification, cb) {
  if (!notification) {
    return cb()
  }
  IO.emit(events.notify, {data: notification}, (err) => {
    if (err) {
      log.error({err: err, notification: notification}, 'notification broadcast failed')
    }
  })
  cb()
}

function notifyCreate (memberId, path, thing, cb) {
  const notification = {
    thread: threadFromPath(path, thing.id),
    member: memberId,
    description: 'created',
    posted: Date.now()
  }

  create(notification, cb)
}

function notifyUpdate (memberId, path, thing, cb) {
  const notification = {
    thread: threadFromPath(path, thing.id),
    member: memberId,
    description: 'updated',
    posted: Date.now()
  }

  create(notification, cb)
}

function notifyMention (memberId, thread, targets, source, cb) {
  const index = targets.indexOf(memberId)
  if (index !== -1) {
    targets.splice(index, 1)
    if (!targets.length) {
      return cb()
    }
  }

  const notification = {
    thread: thread,
    member: memberId,
    description: 'mentioned you',
    targets: targets,
    source: source,
    posted: Date.now()
  }

  create(notification, cb)
}

function notifyComment (memberId, thread, source, cb) {
  const notification = {
    thread: thread,
    member: memberId,
    description: 'posted a new comment',
    source: source,
    posted: Date.now()
  }

  create(notification, cb)
}

function notifyCommunication (memberId, thread, source, cb) {
  const notification = {
    thread: thread,
    member: memberId,
    description: 'posted a new communication',
    source: source,
    posted: Date.now()
  }

  create(notification, cb)
}

function notify (memberId, thread, description, objectId, targets, cb) {
  const notification = {
    thread: thread,
    source: objectId,
    member: memberId,
    description: description,
    targets: targets,
    posted: Date.now()
  }

  create(notification, cb)
}

function create (notification, cb) {
  notification.posted = Date.now()

  Notification.create(notification, (err, _notification) => {
    if (err) {
      log.error({err, notification}, 'error creating notification')
      return cb(Boom.internal())
    }
    _notification.set('unread', true, { strict: false })
    cb(null, _notification.toObject({ getters: true }))
  })
}

function get (id, query, cb) {
  cb = cb || query
  const fields = query.fields

  Notification.findOne({_id: id}, fields, (err, notification) => {
    if (err) {
      log.error({err, notification: id}, 'error getting notification')
      return cb(Boom.internal())
    }
    if (!notification) {
      log.warn({err: 'not found', notification: id}, 'error getting notification')
      return cb(Boom.notFound())
    }

    cb(null, notification.toObject({ getters: true }))
  })
}

function getByThread (path, id, query, cb) {
  cb = cb || query
  const thread = threadFromPath(path, id)
  const filter = {thread, targets: []}
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Notification.find(filter, fields, options, (err, notifications) => {
    if (err) {
      log.error({err, thread}, 'error getting notifications')
      return cb(Boom.internal())
    }

    cb(null, notifications)
  })
}

function getUnreadCount (memberId, query, cb) {
  cb = cb || query

  // var fields = parser(query.fields)
  // var options = {
  //   skip: query.skip,
  //   limit: query.limit,
  //   sort: parser(query.sort)
  // }

  async.waterfall([
    function getSubscriptions (cbAsync) {
      const filter = {member: memberId}
      Subscription.find(filter, (err, subscriptions) => {
        if (err) {
          log.error({err, subscriptions}, 'error getting subscriptions')
          return cbAsync(Boom.internal())
        }
        cbAsync(null, subscriptions)
      })
    },
    function getLastAccess (subscriptions, cbAsync) {
      const filter = {id: memberId}
      const memberFields = {unreadAccess: true}
      Member.findOne(filter, memberFields, (err, member) => {
        if (err) {
          log.error({err, member}, 'error getting member notification accesses')
          return cbAsync(Boom.internal())
        }
        if (!member) {
          log.error({err, member}, 'member not found while getting last access')
          return cbAsync(Boom.notFound())
        }

        cbAsync(null, subscriptions, member.unreadAccess)
      })
    },
    function getUnreadNotifications (subscriptions, access, cbAsync) {
      const filter = {$or: [{targets: {$in: [memberId]}}], posted: {$gt: access}}
      if (subscriptions.length) {
        filter.$or.push({thread: {$in: subscriptions}})
      }
      Notification.count(filter, (err, count) => {
        if (err) {
          log.error({err, count}, 'error counting notifications')
          return cbAsync(Boom.internal())
        }
        cbAsync(null, count)
      })
    }
  ], function done (err, result) {
    if (err) {
      log.error({err}, 'error counting notifications')
      return cb(err)
    }
    cb(null, result)
  })
}

function getByMember (memberId, query, cb) {
  cb = cb || query

  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  async.waterfall([
    function getSubscriptions (cbAsync) {
      const filter = {member: memberId}
      const fields = {thread: true}
      let result = []
      Subscription.find(filter, fields, (err, subscriptions) => {
        if (err) {
          log.error({err, subscriptions}, 'error getting subscriptions')
          return cbAsync(Boom.internal())
        }
        for (let i = 0; i < subscriptions.length; i++) {
          result.push(subscriptions[i].thread)
        }
        cbAsync(null, result)
      })
    },
    function getNotificationsFromSubscriptions (subscriptions, cbAsync) {
      let filter = {$or: [{targets: {$in: [memberId]}}], member: {$ne: memberId}}
      if (subscriptions.length) {
        filter.$or.push({thread: {$in: subscriptions}})
      }
      Notification.find(filter, fields, options, (err, notifications) => {
        if (err) {
          log.error({err, filter}, 'error getting notifications')
          return cbAsync(Boom.internal())
        }

        cbAsync(null, notifications)
      })
    }
  ], function done (err, result) {
    if (err) {
      log.error({err: err}, 'error counting notifications')
      return cb(err)
    }
    cb(null, result)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional

  const filter = {targets: {$size: 0}}
  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Notification.find(filter, fields, options, (err, notifications) => {
    if (err) {
      log.error({err}, 'error getting all notifications')
      return cb(Boom.internal())
    }

    cb(null, notifications)
  })
}

function decorateWithUnreadStatus (memberId, collection, cb) {
  const threads = collection.map((o) => {
    return o.thread
  })

  const filter = { member: memberId, thread: { $in: threads } }
  Access.find(filter, (err, accesses) => {
    if (err) {
      log.error({err, access: filter})
      return cb(Boom.internal())
    }

    let accessLookup = {}
    for (let i = 0, len = accesses.length; i < len; i++) {
      accessLookup[accesses[i].thread] = accesses[i]
    }

    const accessedThreads = accesses.map(function (o) {
      return o.thread
    })

    async.map(collection, (o, asyncCb) => {
      if (accessedThreads.indexOf(o.thread) === -1) {
        o.set('unread', true, { strict: false })
        return asyncCb(null, o)
      }

      const notificationFilter = {thread: o.thread, posted: {$gt: accessLookup[o.thread].last}}
      Notification.count(notificationFilter, (err, count) => {
        if (err) {
          log.error({err, count}, 'error counting notifications')
          return asyncCb()
        }

        o.set('unread', count > 0, { strict: false })
        asyncCb(null, o)
      })
    }, (err, result) => {
      cb(err, result)
    })
  })
}

function remove (id, cb) {
  Notification.findOneAndRemove({id: id}, (err, notification) => {
    if (err) {
      log.error({err, notification: id}, 'error deleting notification')
      return cb(Boom.internal())
    }
    if (!notification) {
      log.warn({err: 'not found', notification: id}, 'error deleting notification')
      return cb(Boom.notFound())
    }

    return cb(null, notification.toObject({ getters: true }))
  })
}

function removeByThread (path, id, cb) {
  let thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  Notification.remove({thread}, (err, notifications) => {
    if (err) {
      log.error({err, thread}, 'error removing notifications')
      return cb(Boom.internal())
    }

    cb(null)
  })
}

function removeBySource (source, cb) {
  Notification.remove({source}, (err, notifications) => {
    if (err) {
      log.error({err, source}, 'error removing notifications')
      return cb(Boom.internal())
    }

    cb(null)
  })
}
