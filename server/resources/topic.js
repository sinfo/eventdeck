var Boom = require('boom')
var slug = require('slug')
var server = require('server').hapi
var log = require('server/helpers/logger')
var threadFromPath = require('server/helpers/threadFromPath')
var parser = require('server/helpers/fieldsParser')
var Topic = require('server/db/topic')

server.method('topic.create', create, {})
server.method('topic.update', update, {})
server.method('topic.get', get, {})
server.method('topic.getByMember', getByMember, {})
server.method('topic.getByDueDate', getByDueDate, {})
server.method('topic.getByTag', getByTag, {})
server.method('topic.list', list, {})
server.method('topic.remove', remove, {})
server.method('topic.search', search, {})

function create (topic, memberId, cb) {
  topic.posted = Date.now()
  topic.updated = Date.now()
  topic.author = memberId

  Topic.create(topic, function (err, _topic) {
    if (err) {
      log.error({err: err, topic: topic}, 'error creating topic')
      return cb(Boom.internal())
    }

    cb(null, _topic.toObject({ getters: true }))
  })
}

function update (id, topic, cb) {
  topic.updated = Date.now()
  var filter = { _id: id }
  Topic.findOneAndUpdate(filter, topic, function (err, _topic) {
    if (err) {
      log.error({err: err, topic: id}, 'error updating topic')
      return cb(Boom.internal())
    }
    if (!_topic) {
      log.warn({err: 'not found', topic: id}, 'error updating topic')
      return cb(Boom.notFound())
    }

    cb(null, _topic)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional
  var fields = query.fields
  var filter = { _id: id }
  Topic.findOne(filter, fields, function (err, topic) {
    if (err) {
      log.error({err: err, topic: id}, 'error getting topic')
      return cb(Boom.internal())
    }
    if (!topic) {
      log.warn({err: 'not found', topic: id}, 'error getting topic')
      return cb(Boom.notFound())
    }

    cb(null, topic)
  })
}

function getByMember (memberId, query, cb) {
  cb = cb || query

  var filter = { targets: { $in: [memberId] } }
  var fields = query.fields
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Topic.find(filter, fields, options, function (err, topics) {
    if (err) {
      log.error({err: err, member: memberId}, 'error getting topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function getByDueDate (start, end, query, cb) {
  cb = cb || query
  var filter = { duedate: { $gte: start, $lt: end } }
  var fields = query.fields
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Topic.find(filter, fields, options, function (err, topics) {
    if (err) {
      log.error({err: err, dates: filter}, 'error getting topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function getByTag (tagId, query, cb) {
  cb = cb || query
  var filter = { tags: { $in: [tagId] } }
  var fields = query.fields
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Topic.find(filter, fields, options, function (err, topics) {
    if (err) {
      log.error({err: err, tag: tagId}, 'error getting topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional

  var filter = {}
  var fields = parser(query.fields)
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Topic.find(filter, fields, options, function (err, topics) {
    if (err) {
      log.error({err: err}, 'error getting all topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function remove (id, cb) {
  var filter = { _id: id }
  Topic.findOneAndRemove(filter, function (err, topic) {
    if (err) {
      log.error({err: err, topic: id}, 'error deleting topic')
      return cb(Boom.internal())
    }
    if (!topic) {
      log.warn({err: 'not found', topic: id}, 'error deleting topic')
      return cb(Boom.notFound())
    }

    return cb(null, topic)
  })
}

function search (str, query, cb) {
  cb = cb || query // fields is optional

  var filter = { name: new RegExp(str, 'i') }
  var fields = parser(query.fields || 'id,name,kind')
  var options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  }

  Topic.find(filter, fields, options, function (err, exactTopics) {
    if (err) {
      log.error({err: err, filter: filter}, 'error getting topics')
      return cb(Boom.internal())
    }

    if (exactTopics.length > 0) {
      return cb(null, { exact: exactTopics })
    }

    filter = {
      $or: [
        { text: new RegExp(str, 'i') },
        { kind: new RegExp(str, 'i') }
      ]
    }

    Topic.find(filter, fields, options, function (err, extendedTopics) {
      if (err) {
        log.error({err: err, filter: filter}, 'error getting topics')
        return cb(Boom.internal())
      }

      return cb(null, { exact: exactTopics, extended: extendedTopics })
    })
  })
}
