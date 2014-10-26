var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var Speaker = require('server/db/models/speaker');


server.method('speaker.create', create, {});
server.method('speaker.update', update, {});
server.method('speaker.get', get, {});
server.method('speaker.getByMember', getByMember, {});
server.method('speaker.getByEvent', getByEvent, {});
server.method('speaker.list', list, {});
server.method('speaker.remove', remove, {});


function create(speaker, memberId, cb) {
  speaker.id = speaker.id || slug(speaker.name);
  speaker.updated = Date.now();

  Speaker.create(speaker, function(err, _speaker) {
    if (err) {
      log.error({ err: err, speaker: speaker}, 'error creating speaker');
      return cb(Boom.internal());
    }

    cb(null, _speaker);
  });
}

function update(id, speaker, cb) {
  speaker.updated = Date.now();
  var filter = {id:id};
  Speaker.findOneAndUpdate(filter, speaker, function(err, _speaker) {
    if (err) {
      log.error({ err: err, speaker: id}, 'error updating speaker');
      return cb(Boom.internal());
    }
    if (!_speaker) {
      log.warn({ err: 'not found', speaker: id}, 'error updating speaker');
      return cb(Boom.notFound());
    }

    cb(null, _speaker);
  });
}

function get(id,query, cb) {
  cb = cb || query; // fields is optional

  var fields = parser(query.fields);
  var filter = {id:id};
  Speaker.findOne(filter,fields, function(err, speaker) {
    if (err) {
      log.error({ err: err, speaker: id}, 'error getting speaker');
      return cb(Boom.internal());
    }
    if (!speaker) {
      log.warn({ err: 'not found', speaker: id}, 'error getting speaker');
      return cb(Boom.notFound());
    }

    cb(null, speaker);
  });
}

function getByMember(memberId,query, cb) {
  cb = cb || query;
  var filter = { participations: { $elemMatch: { member: memberId } } };
  var fields = query.fields;
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Speaker.find(filter,fields,options, function(err, speaker) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting speaker');
      return cb(Boom.internal());
    }

    cb(null, speaker);
  });
}

function getByEvent(eventId,query, cb) {
  cb = cb||query;
  var filter = { participations: { $elemMatch: { event: eventId } } };
  var fields = query.fields;
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };
  Speaker.find(filter,fields,options, function(err, speaker) {
    if (err) {
      log.error({ err: err, event: eventId}, 'error getting speaker');
    }

    cb(null, speaker);
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
  Speaker.find(fileter,fields,options, function(err, speaker) {
    if (err) {
      log.error({ err: err}, 'error getting all speaker');
      return cb(Boom.internal());
    }
    
    cb(null, speaker);
  });
}

function remove(id, cb) {
  var filter = {id:id};
  Speaker.findOneAndRemove(filter, function(err, speaker){
    if (err) {
      log.error({ err: err, speaker: id}, 'error deleting speaker');
      return cb(Boom.internal());
    }
    if (!speaker) {
      log.error({ err: err, speaker: id}, 'error deleting speaker');
      return cb(Boom.notFound());
    }

    return cb(null, speaker);
  });
}