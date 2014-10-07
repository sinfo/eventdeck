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
};

function update(id, speaker, cb) {
  speaker.updated = Date.now();

  Speaker.findOneAndUpdate({id: id}, speaker, function(err, _speaker) {
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
};

function get(id, cb) {
  Speaker.findOne({id: id}, function(err, speaker) {
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
};

function getByMember(memberId, cb) {
  Speaker.find({ participations: { $elemMatch: { member: memberId } } }, function(err, speaker) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting speaker');
      return cb(Boom.internal());
    }

    cb(null, speaker);
  });
};

function list(cb) {
  Speaker.find({}, function(err, speaker) {
    if (err) {
      log.error({ err: err}, 'error getting all speaker');
      return cb(Boom.internal());
    }
    
    cb(null, speaker);
  });
};

function remove(id, cb) {
  Speaker.findOneAndRemove({id: id}, function(err, speaker){
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
};