const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Topic = require('../db/topic')

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

  Topic.create(topic, (err, _topic) => {
    if (err) {
      log.error({err: err, topic: topic}, 'error creating topic')
      return cb(Boom.internal())
    }

    cb(null, _topic.toObject({ getters: true }))
  })
}

function update (id, topic, cb) {
  topic.updated = Date.now()
  Topic.findByIdAndUpdate(id, topic, {new: true}, (err, _topic) => {
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
  const fields = query.fields
  Topic.findById(id, fields, (err, topic) => {
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

  const filter = { targets: { $in: [memberId] } }
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Topic.find(filter, fields, options, (err, topics) => {
    if (err) {
      log.error({err: err, member: memberId}, 'error getting topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function getByDueDate (start, end, query, cb) {
  cb = cb || query
  const filter = { duedate: { $gte: start, $lt: end } }
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Topic.find(filter, fields, options, (err, topics) => {
    if (err) {
      log.error({err: err, dates: filter}, 'error getting topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function getByTag (tagId, query, cb) {
  cb = cb || query
  const filter = { tags: { $in: [tagId] } }
  const fields = query.fields
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Topic.find(filter, fields, options, (err, topics) => {
    if (err) {
      log.error({err: err, tag: tagId}, 'error getting topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional

  const filter = {}
  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }

  Topic.find(filter, fields, options, (err, topics) => {
    if (err) {
      log.error({err: err}, 'error getting all topics')
      return cb(Boom.internal())
    }

    cb(null, topics)
  })
}

function remove (id, cb) {
  Topic.findByIdAndRemove(id, (err, topic) => {
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

  let filter = { name: new RegExp(str, 'i') }
  const fields = parser(query.fields || 'id,name,kind')
  const options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  }

  Topic.find(filter, fields, options, (err, exactTopics) => {
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

    Topic.find(filter, fields, options, (err, extendedTopics) => {
      if (err) {
        log.error({err: err, filter: filter}, 'error getting topics')
        return cb(Boom.internal())
      }

      return cb(null, { exact: exactTopics, extended: extendedTopics })
    })
  })
}
