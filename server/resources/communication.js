var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var Communication = require('server/db/models/communication');


server.method('communication.create', create, {});
server.method('communication.update', update, {});
server.method('communication.get', get, {});
server.method('communication.getByMember', getByMember, {});
server.method('communication.getByThread', getByThread, {});
server.method('communication.getByEvent', getByEvent, {});
server.method('communication.list', list, {});
server.method('communication.remove', remove, {});


function create(communication, memberId, cb) {
  communication.status = 'pending-review';
  communication.member = memberId;
  communication.posted = Date.now();
  communication.updated = Date.now();

  Communication.create(communication, function(err, _communication) {
    if (err) {
      log.error({ err: err, communication: communication}, 'error creating communication');
      return cb(Boom.internal());
    }

    cb(null, _communication);
  });
};

function update(id, communication, cb) {
  communication.updated = Date.now();
  var filter = {_id: id};
  Communication.findOneAndUpdate(filter, communication, function(err, _communication) {
    if (err) {
       g.error({ err: err, communication: id}, 'error updating communication');
      return cb(Boom.internal());
    }
    if (!_communication) {
      log.warn({ err: 'not found', communication: id}, 'error updating communication');
      return cb(Boom.notFound());
    }

    cb(null, _communication);
  });
};

function get(id, cb) {
  var filter = {_id: id};
  Communication.findOne(filter, function(err, communication) {
    if (err) {
      log.error({ err: err, communication: id}, 'error getting communication');
      return cb(Boom.internal());
    }
    if (!communication) {
      log.warn({ err: 'not found', communication: id}, 'error getting communication');
      return cb(Boom.notFound());
    }

    cb(null, communication);
  });
};

function getByMember(memberId, cb) {
  var filter = {member:memberId}
  Communication.find(filter, function(err, communications) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting communications');
      return cb(Boom.internal());
    }

    cb(null, communications);
  });
};

function getByThread(path, id, cb) {
  var thread = threadFromPath(path, id);
  var filter = {thread: thread};
  Communication.find(filter, function(err, communications) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting communications');
      return cb(Boom.internal());
    }

    cb(null, communications);
  });
};

function getByEvent(eventId, cb) {
  var filter = {event: eventId};
  Communication.find(filter, function(err, communications) {
    if (err) {
      log.error({ err: err, event: eventId}, 'error getting communications');
      return cb(Boom.internal());
    }

    cb(null, communications);
  });
};

function list(cb) {
  Communication.find({}, function(err, communications) {
    if (err) {
      log.error({ err: err}, 'error getting all communications');
      return cb(Boom.internal());
    }
    
    cb(null, communications);
  });
};

function remove(id, cb) {
  var filter = {id:id}
  Communication.findOneAndRemove(filter, function(err, communication){
    if (err) {
      log.error({ err: err, communication: id}, 'error deleting communication');
      return cb(Boom.internal());
    }
    if (!communication) {
      log.error({ err: err, communication: id}, 'error deleting communication');
      return cb(Boom.notFound());
    }

    return cb(null, communication);
  });
};