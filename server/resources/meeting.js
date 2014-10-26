var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var Meeting = require('server/db/models/meeting');


server.method('meeting.create', create, {});
server.method('meeting.update', update, {});
server.method('meeting.get', get, {});
server.method('meeting.list', list, {});
server.method('meeting.remove', remove, {});


function create(meeting, memberId, cb) {
  Meeting.create(meeting, function(err, _meeting) {
    if (err) {
      log.error({ err: err, meeting: meeting}, 'error creating meeting');
      return cb(Boom.internal());
    }

    cb(null, _meeting);
  });
}

function update(id, meeting, cb) {
  var filter = {_id: id};
  Meeting.findOneAndUpdate(filter, meeting, function(err, _meeting) {
    if (err) {
      log.error({ err: err, meeting: id}, 'error updating meeting');
      return cb(Boom.internal());
    }
    if (!_meeting) {
      log.warn({ err: 'not found', meeting: id}, 'error updating meeting');
      return cb(Boom.notFound());
    }

    cb(null, _meeting);
  });
}

function get(id, cb) {
  var filter = {_id:id};
  Meeting.findOne(filter, function(err, meeting) {
    if (err) {
      log.error({ err: err, meeting: id}, 'error getting meeting');
      return cb(Boom.internal());
    }
    if (!meeting) {
      log.warn({ err: 'not found', meeting: id}, 'error getting meeting');
      return cb(Boom.notFound());
    }

    cb(null, meeting);
  });
}

function list(cb) {
  Meeting.find({}, function(err, meetings) {
    if (err) {
      log.error({ err: err}, 'error getting all meetings');
      return cb(Boom.internal());
    }
    
    cb(null, meetings);
  });
}

function remove(id, cb) {
  var filter = {_id: id};
  Meeting.findOneAndRemove(filter, function(err, meeting){
    if (err) {
      log.error({ err: err, meeting: id}, 'error deleting meeting');
      return cb(Boom.internal());
    }
    if (!meeting) {
      log.error({ err: err, meeting: id}, 'error deleting meeting');
      return cb(Boom.notFound());
    }

    return cb(null, meeting);
  });
}