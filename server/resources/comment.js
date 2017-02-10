const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const threadFromPath = require('../helpers/threadFromPath')
const Comment = require('../db/comment')

server.method('comment.create', create, {})
server.method('comment.update', update, {})
server.method('comment.get', get, {})
server.method('comment.getByMember', getByMember, {})
server.method('comment.getByThread', getByThread, {})
server.method('comment.getBySubthread', getBySubthread, {})
server.method('comment.list', list, {})
server.method('comment.remove', remove, {})
server.method('comment.removeByThread', removeByThread, {})

function create (comment, memberId, cb) {
  comment.member = memberId
  comment.posted = Date.now()
  comment.updated = Date.now()

  Comment.create(comment, (err, _comment) => {
    if (err) {
      log.error({err: err, comment: comment}, 'error creating comment')
      return cb(Boom.internal())
    }

    cb(null, _comment)
  })
}

function update (id, comment, cb) {
  comment.updated = Date.now()

  Comment.findByIdAndUpdate(id, comment, {new: true}, (err, _comment) => {
    if (err) {
      log.error({err: err, comment: id}, 'error updating comment')
      return cb(Boom.internal())
    }
    if (!_comment) {
      log.warn({err: 'not found', comment: id}, 'error updating comment')
      return cb(Boom.notFound())
    }

    cb(null, _comment)
  })
}

function get (id, query, cb) {
  cb = cb || query
  const fields = parser(query.fields)

  Comment.findById(id, fields, (err, comment) => {
    if (err) {
      log.error({err: err, comment: id}, 'error getting comment')
      return cb(Boom.internal())
    }
    if (!comment) {
      log.warn({err: 'not found', comment: id}, 'error getting comment')
      return cb(Boom.notFound())
    }

    cb(null, comment)
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
  Comment.find({member: memberId}, fields, options, (err, comments) => {
    if (err) {
      log.error({err: err, member: memberId}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function getByThread (path, id, query, cb) {
  cb = cb || query
  const thread = threadFromPath(path, id)
  const filter = {thread: thread}
  const fields = parser(query.fields)
  Comment.find(filter, fields, filter, (err, comments) => {
    if (err) {
      log.error({err: err, thread: thread}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function getBySubthread (path, id, query, cb) {
  cb = cb || query
  const subthread = threadFromPath(path, id)
  const filter = {subthread: subthread}
  const fields = parser(query.fields)
  Comment.find(filter, fields, filter, (err, comments) => {
    if (err) {
      log.error({err: err, subthread: subthread}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function list (query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)
  const options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Comment.find({}, fields, options, (err, comments) => {
    if (err) {
      log.error({err: err}, 'error getting all comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function remove (id, cb) {
  Comment.findByIdAndRemove(id, (err, comment) => {
    if (err) {
      log.error({err: err, comment: id}, 'error deleting comment')
      return cb(Boom.internal())
    }
    if (!comment) {
      log.warn({err: 'not found', comment: id}, 'error updating comment')
      return cb(Boom.notFound())
    }

    return cb(null, comment)
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

  const filter = {thread: thread}
  Comment.remove(filter, (err, comments) => {
    if (err) {
      log.error({err: err, thread: thread}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}
