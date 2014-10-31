var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Event = require('server/db/event');


server.method('event.create', create, {});
server.method('event.update', update, {});
server.method('event.get', get, {});
server.method('event.list', list, {});
server.method('event.remove', remove, {});


function create(event, memberId, cb) {
  event.id = slug(event.id || event.name).toLowerCase();
  event.updated = Date.now();

  Event.create(event, function(err, _event) {
    if (err) {
      log.error({ err: err, event: event}, 'error creating event');
      return cb(Boom.internal());
    }

    cb(null, _event);
  });
}

function update(id, event, cb) {
  event.updated = Date.now();

  Event.findOneAndUpdate({id: id}, event, function(err, _event) {
    if (err) {
      log.error({ err: err, event: id}, 'error updating event');
      return cb(Boom.internal());
    }
    if (!_event) {
      log.warn({ err: 'not found', event: id}, 'error updating event');
      return cb(Boom.notFound());
    }

    cb(null, _event);
  });
}

function get(id, query, cb) {
  cb = cb || query; // fields is optional

  var fields = parser(query.fields);

  Event.findOne({id: id}, fields, function(err, event) {
    if (err) {
      log.error({ err: err, event: id}, 'error getting event');
      return cb(Boom.internal());
    }
    if (!event) {
      log.warn({ err: 'not found', event: id}, 'error getting event');
      return cb(Boom.notFound());
    }

    cb(null, event);
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

  Event.find(filter, fields,options, function(err, events) {
    if (err) {
      log.error({ err: err}, 'error getting all events');
      return cb(Boom.internal());
    }
    
    cb(null, events);
  });
}

function remove(id, cb) {
  Event.findOneAndRemove({id: id}, function(err, event){
    if (err) {
      log.error({ err: err, event: id}, 'error deleting event');
      return cb(Boom.internal());
    }
    if (!event) {
      log.error({ err: err, event: id}, 'error deleting event');
      return cb(Boom.notFound());
    }

    return cb(null, event);
  });
}