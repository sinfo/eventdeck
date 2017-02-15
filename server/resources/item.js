const Boom = require('boom')
const slug = require('slug')
const server = require('../index').hapi
const log = require('../helpers/logger')
const parser = require('../helpers/fieldsParser')
const Item = require('../db/item')

server.method('item.create', create, {})
server.method('item.update', update, {})
server.method('item.get', get, {})
server.method('item.list', list, {})
server.method('item.remove', remove, {})

function create (item, memberId, cb) {
  item.id = slug(item.id || item.name).toLowerCase()

  Item.create(item, function (err, _item) {
    if (err) {
      log.error({err, item: item}, 'error creating item')
      return cb(Boom.internal())
    }

    cb(null, _item)
  })
}

function update (id, item, cb) {
  Item.findOneAndUpdate({ id: id }, item, {new: true}, (err, _item) => {
    if (err) {
      log.error({err, item: id}, 'error updating item')
      return cb(Boom.internal())
    }
    if (!_item) {
      log.warn({err: 'not found', item: id}, 'error updating item')
      return cb(Boom.notFound())
    }

    cb(null, _item)
  })
}

function get (id, query, cb) {
  cb = cb || query
  const fields = parser(query.fields)

  Item.findOne({ id: id }, fields, (err, item) => {
    if (err) {
      log.error({err, item: id}, 'error getting item')
      return cb(Boom.internal())
    }
    if (!item) {
      log.warn({err: 'not found', item: id}, 'error getting item')
      return cb(Boom.notFound())
    }

    cb(null, item)
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

  Item.find({}, fields, options, (err, items) => {
    if (err) {
      log.error({err}, 'error getting all items')
      return cb(Boom.internal())
    }

    cb(null, items)
  })
}

function remove (id, cb) {
  Item.findOneAndRemove({ id: id }, (err, item) => {
    if (err) {
      log.error({err, item: id}, 'error deleting item')
      return cb(Boom.internal())
    }
    if (!item) {
      log.warn({err: 'not found', item: id}, 'error deleting item')
      return cb(Boom.notFound())
    }

    return cb(null, item)
  })
}
