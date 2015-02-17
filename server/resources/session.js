var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Session = require('server/db/session');


server.method('session.create', create, {});
server.method('session.update', update, {});
server.method('session.get', get, {});
server.method('session.list', list, {});
server.method('session.remove', remove, {});


function create(session, memberId, cb) {
  session.updated = Date.now();
  session.id = slug(session.id || session.name).toLowerCase();

  Session.create(session, function(err, _session) {
    if (err) {
      log.error({ err: err, session: session}, 'error creating session');
      return cb(Boom.internal());
    }

    cb(null, _session);
  });
}

function update(id, session, cb) {
  session.updated = Date.now();
  var filter = {id:id};
  Session.findOneAndUpdate(filter, session, function(err, _session) {
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
}

function get(id,query, cb) {
  cb = cb||query;
  var filter = {id:id};
  var fields = query.fields;

  Session.findOne(filter, fields, function(err, session) {
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
}

function list(query,cb) {
  cb = cb ||query;
  var filter = {};
  var fields = query.fields;
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Session.find(filter,fields,options, function(err, sessions) {
    if (err) {
      log.error({ err: err}, 'error getting all sessions');
      return cb(Boom.internal());
    }

    cb(null, sessions);
  });
}

function remove(id, cb) {
  var filter = {id:id};
  Session.findOneAndRemove(filter, function(err, session){
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
}