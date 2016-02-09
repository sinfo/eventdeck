var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var parser = require('server/helpers/fieldsParser');
var Speaker = require('server/db/speaker');
var dupKeyParser = require('server/helpers/dupKeyParser');


server.method('speaker.create', create, {});
server.method('speaker.update', update, {});
server.method('speaker.get', get, {});
server.method('speaker.getByMember', getByMember, {});
server.method('speaker.getByEvent', getByEvent, {});
server.method('speaker.list', list, {});
server.method('speaker.remove', remove, {});
server.method('speaker.search', search, {});


function create(speaker, memberId, cb) {
  speaker.id = slug(speaker.id || speaker.name).toLowerCase();
  speaker.updated = Date.now();

  Speaker.create(speaker, function(err, _speaker) {
    if (err) {
      if(err.code == 11000) {
        log.warn({err:err, requestedSpeaker: speaker.id}, 'speaker is a duplicate');
        return cb(Boom.conflict(dupKeyParser(err.err)+' is a duplicate'));
      }

      log.error({ err: err, speaker: speaker}, 'error creating speaker');
      return cb(Boom.internal());
    }
    cb(null, _speaker.toObject({ getters: true }));
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
  var eventsFilter = {};
  var filter = {};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort),
    random_sample:Math.floor((Math.random()*50)+1)
  };

  if (typeof query.member !== 'undefined') {
    if (query.member === false) {
      query.member = { $exists: false };
    }
    eventsFilter.member = query.member;
  }
  if (query.event) {
    eventsFilter.event = query.event;
  }

  if (eventsFilter.event || eventsFilter.member) {
    filter.participations = query.participations ? {$elemMatch : eventsFilter} : {$not: {$elemMatch : eventsFilter} };
  }

  Speaker.find(filter, fields, options, function(err, speaker) {
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

function search(str, query, cb) {
  cb = cb || query; // fields is optional

  var filter = { name: new RegExp(str, 'i') };
  var fields = parser(query.fields || 'id,name,img');
  var options = {
    skip: query.skip,
    limit: query.limit || 10,
    sort: parser(query.sort)
  };

  Speaker.find(filter, fields, options, function(err, exactSpeakers) {
    if (err) {
      log.error({ err: err, filter: filter}, 'error getting speakers');
      return cb(Boom.internal());
    }

    if (exactSpeakers.length > 0) {
      return cb(null, { exact: exactSpeakers });
    }

    filter = {
      $or: [
        { contacts: new RegExp(str, 'i') },
        { area: new RegExp(str, 'i') },
        { information: new RegExp(str, 'i') },
        { 'participations.status': new RegExp(str, 'i') },
      ]
    };

    Speaker.find(filter, fields, options, function(err, extendedSpeakers) {
      if (err) {
        log.error({ err: err, filter: filter}, 'error getting speakers');
        return cb(Boom.internal());
      }

      return cb(null, { exact: exactSpeakers, extended: extendedSpeakers });
    });

  });
}
