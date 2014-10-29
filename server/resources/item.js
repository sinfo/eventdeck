var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Item = require('server/db/models/item');


server.method('item.create', create, {});
server.method('item.update', update, {});
server.method('item.get', get, {});
server.method('item.list', list, {});
server.method('item.remove', remove, {});


function create(item, memberId, cb) {
  item.id = slug(item.id || item.name).toLowerCase();

  Item.create(item, function(err, _item) {
    if (err) {
      log.error({ err: err, item: item}, 'error creating item');
      return cb(Boom.internal());
    }

    cb(null, _item);
  });
}

function update(id, item, cb) {
  var filter = { id: id };

  Item.findOneAndUpdate(filter, item, function(err, _item) {
    if (err) {
      log.error({ err: err, item: id}, 'error updating item');
      return cb(Boom.internal());
    }
    if (!_item) {
      log.warn({ err: 'not found', item: id}, 'error updating item');
      return cb(Boom.notFound());
    }

    cb(null, _item);
  });
}

function get(id,query, cb) {
  cb = cb || query;

  var filter = { id: id };
  var fields = parser(query.fields);

  Item.findOne(filter,fields, function(err, item) {
    if (err) {
      log.error({ err: err, item: id}, 'error getting item');
      return cb(Boom.internal());
    }
    if (!item) {
      log.warn({ err: 'not found', item: id}, 'error getting item');
      return cb(Boom.notFound());
    }

    cb(null, item);
  });
}

function list(query, cb) {
  cb = cb || query; // fields is optional

  var filter = {};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Item.find(filter,fields,options, function(err, items) {
    if (err) {
      log.error({ err: err}, 'error getting all items');
      return cb(Boom.internal());
    }
    
    cb(null, items);
  });
}

function remove(id, cb) {
  var filter = { id: id };
  
  Item.findOneAndRemove(filter, function(err, item){
    if (err) {
      log.error({ err: err, item: id}, 'error deleting item');
      return cb(Boom.internal());
    }
    if (!item) {
      log.error({ err: err, item: id}, 'error deleting item');
      return cb(Boom.notFound());
    }

    return cb(null, item);
  });
}