const Boom = require('boom')
const slug = require('slug')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Tag = require('../db/tag')

server.method('tag.create', create, {})
server.method('tag.update', update, {})
server.method('tag.get', get, {})
server.method('tag.list', list, {})
server.method('tag.remove', remove, {})

function create (tag, memberId, cb) {
  tag.id = slug(tag.id || tag.name).toLowerCase()

  Tag.create(tag, (err, _tag) => {
    if (err) {
      log.error({err, tag}, 'error creating tag')
      return cb(Boom.internal())
    }

    cb(null, _tag)
  })
}

function update (id, tag, cb) {
  Tag.findOneAndUpdate({id: id}, tag, {new: true}, (err, _tag) => {
    if (err) {
      log.error({err, tag: id}, 'error updating tag')
      return cb(Boom.internal())
    }
    if (!_tag) {
      log.warn({err: 'not found', tag: id}, 'error updating tag')
      return cb(Boom.notFound())
    }

    cb(null, _tag)
  })
}

function get (id, query, cb) {
  cb = cb || query // fields is optional

  const fields = parser(query.fields)
  Tag.findOne({id: id}, fields, (err, tag) => {
    if (err) {
      log.error({err, tag: id}, 'error getting tag')
      return cb(Boom.internal())
    }
    if (!tag) {
      log.warn({err: 'not found', tag: id}, 'error getting tag')
      return cb(Boom.notFound())
    }

    cb(null, tag)
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

  Tag.find({}, fields, options, (err, companies) => {
    if (err) {
      log.error({err}, 'error getting all companies')
      return cb(Boom.internal())
    }

    cb(null, companies)
  })
}
function remove (id, cb) {
  Tag.findOneAndRemove({id: id}, (err, tag) => {
    if (err) {
      log.error({err, tag: id}, 'error deleting tag')
      return cb(Boom.internal())
    }
    if (!tag) {
      log.error({err, tag: id}, 'error deleting tag')
      return cb(Boom.notFound())
    }

    return cb(null, tag)
  })
}
