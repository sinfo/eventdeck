var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Tag = require('server/db/models/tag');


server.method('tag.create', create, {});
server.method('tag.update', update, {});
server.method('tag.get', get, {});
server.method('tag.list', list, {});
server.method('tag.remove', remove, {});


function create(tag, memberId, cb) {
  tag.id = slug(tag.id || tag.name).toLowerCase();

  Tag.create(tag, function(err, _tag) {
    if (err) {
      log.error({ err: err, tag: tag}, 'error creating tag');
      return cb(Boom.internal());
    }

    cb(null, _tag);
  });
}

function update(id, tag, cb) {
  var filter = {id:id};
  Tag.findOneAndUpdate(filter, tag, function(err, _tag) {
    if (err) {
      log.error({ err: err, tag: id}, 'error updating tag');
      return cb(Boom.internal());
    }
    if (!_tag) {
      log.warn({ err: 'not found', tag: id}, 'error updating tag');
      return cb(Boom.notFound());
    }

    cb(null, _tag);
  });
}

function get(id,query, cb) {
  cb = cb || query; // fields is optional
  var filter = {id:id};

  var fields = parser(query.fields);
  Tag.findOne(filter,fields, function(err, tag) {
    if (err) {
      log.error({ err: err, tag: id}, 'error getting tag');
      return cb(Boom.internal());
    }
    if (!tag) {
      log.warn({ err: 'not found', tag: id}, 'error getting tag');
      return cb(Boom.notFound());
    }

    cb(null, tag);
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

  Tag.find(filter, fields, options, function(err, companies) {
    if (err) {
      log.error({ err: err}, 'error getting all companies');
      return cb(Boom.internal());
    }
    
    cb(null, companies);
  });
}
function remove(id, cb) {
  var filter = {id:id};
  Tag.findOneAndRemove(filter, function(err, tag){
    if (err) {
      log.error({ err: err, tag: id}, 'error deleting tag');
      return cb(Boom.internal());
    }
    if (!tag) {
      log.error({ err: err, tag: id}, 'error deleting tag');
      return cb(Boom.notFound());
    }

    return cb(null, tag);
  });
}