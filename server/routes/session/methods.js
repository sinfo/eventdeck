var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var Session = require('server/db/models/session');


server.method('session.create', create, {});
server.method('session.update', update, {});
server.method('session.get', get, {});
server.method('session.list', list, {});
server.method('session.remove', remove, {});


function create(session, memberId, cb) {
  session.id = session.id || slug(session.name);

  Session.create(session, function(err, _session) {
    if (err) {
      log.error({ err: err, session: session}, 'error creating session');
      return cb(Boom.internal());
    }

    cb(null, _session);
  });
};

function update(id, session, cb) {
  Session.findOneAndUpdate({$or:[{id: id}, {_id: id}}, session, function(err, _session) {
    if (err) {
      log.error({ err: err, session: id}, 'error updating session');
      return cb(Boom.internal());
    }
    if (!_session) {
      log.warn({ err: 'not found', session: id}, 'error updating session');
      return cb(Boom.notFound());
    }

    cb(null, _session);
  });
};

function get(id, cb) {
  Session.findOne({$or:[{id: id}, {_id: id}}, function(err, session) {
    if (err) {
      log.error({ err: err, session: id}, 'error getting session');
      return cb(Boom.internal());
    }
    if (!session) {
      log.warn({ err: 'not found', session: id}, 'error getting session');
      return cb(Boom.notFound());
    }

    cb(null, session);
  });
};

function list(cb) {
  Session.find({}, function(err, sessions) {
    if (err) {
      log.error({ err: err}, 'error getting all sessions');
      return cb(Boom.internal());
    }
    
    cb(null, sessions);
  });
};

function remove(id, cb) {
  Session.findOneAndRemove({$or:[{id: id}, {_id: id}}, function(err, session){
    if (err) {
      log.error({ err: err, session: id}, 'error deleting session');
      return cb(Boom.internal());
    }
    if (!session) {
      log.error({ err: err, session: id}, 'error deleting session');
      return cb(Boom.notFound());
    }

    return cb(null, session);
  });
};