var Boom = require('boom')
var server = require('server').hapi
var log = require('server/helpers/logger')
var parser = require('server/helpers/fieldsParser')
var threadFromPath = require('server/helpers/threadFromPath')
var Comment = require('server/db/comment')

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

  Comment.create(comment, function (err, _comment) {
    if (err) {
      log.error({err: err, comment: comment}, 'error creating comment')
      return cb(Boom.internal())
    }

    cb(null, _comment)
  })
}

function update (id, comment, cb) {
  comment.updated = Date.now()
  var filter = {_id: id}

  Comment.findOneAndUpdate(filter, comment, function (err, _comment) {
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
  var filter = {_id: id}
  var fields = parser(query.fields)

  Comment.findOne(filter, fields, function (err, comment) {
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
  var filter = {member: memberId}
  var fields = parser(query.fields)
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  }
  Comment.find(filter, fields, options, function (err, comments) {
    if (err) {
      log.error({err: err, member: memberId}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function getByThread (path, id, query, cb) {
  cb = cb || query
  var thread = threadFromPath(path, id)
  var filter = {thread: thread}
  var fields = parser(query.fields)
  Comment.find(filter, fields, filter, function (err, comments) {
    if (err) {
      log.error({err: err, thread: thread}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function getBySubthread (path, id, query, cb) {
  cb = cb || query
  var subthread = threadFromPath(path, id)
  var filter = {subthread: subthread}
  var fields = parser(query.fields)
  Comment.find(filter, fields, filter, function (err, comments) {
    if (err) {
      log.error({err: err, subthread: subthread}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
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
  Comment.find(filter, fields, options, function (err, comments) {
    if (err) {
      log.error({err: err}, 'error getting all comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}

function remove (id, cb) {
  var filter = {_id: id}

  Comment.findOneAndRemove(filter, function (err, comment) {
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
  var thread = ''
  if (typeof (id) === 'function') {
    thread = path
    cb = id
  } else {
    thread = threadFromPath(path, id)
  }

  var filter = {thread: thread}
  Comment.remove(filter, function (err, comments) {
    if (err) {
      log.error({err: err, thread: thread}, 'error getting comments')
      return cb(Boom.internal())
    }

    cb(null, comments)
  })
}
