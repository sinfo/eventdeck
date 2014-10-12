var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var fieldsParser = require('server/helpers/fieldsParser');
var Event = require('server/db/models/event');


server.method('event.create', create, {});
server.method('event.update', update, {});
server.method('event.get', get, {});
server.method('event.list', list, {});
server.method('event.remove', remove, {});


function create(event, memberId, cb) {
  event.id = event.id || slug(event.name);
  event.updated = Date.now();

  Event.create(event, function(err, _event) {
    if (err) {
      log.error({ err: err, event: event}, 'error creating event');
      return cb(Boom.internal());
    }

    cb(_event);
  });
};

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

    cb(_event);
  });
};

function get(id, fields, cb) {
  cb = cb || fields; // fields is optional

  Event.findOne({id: id}, fieldsParser(fields), function(err, event) {
    if (err) {
      log.error({ err: err, event: id}, 'error getting event');
      return cb(Boom.internal());
    }
    if (!event) {
      log.warn({ err: 'not found', event: id}, 'error getting event');
      return cb(Boom.notFound());
    }

    cb(event);
  });
};

function list(fields, cb) {
  cb = cb || fields; // fields is optional

  Event.find({}, fieldsParser(fields), function(err, events) {
    if (err) {
      log.error({ err: err}, 'error getting all events');
      return cb(Boom.internal());
    }
    
    cb(events);
  });
};

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

    return cb(event);
  });
};