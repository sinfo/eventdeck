var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var parser = require('server/helpers/fieldsParser');
var Meeting = require('server/db/meeting');


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

function get(id,query, cb) {
  cb = cb||query;
  var filter = {_id:id};
  var fields = parser(query.fields);

  Meeting.findOne(filter,fields, function(err, meeting) {
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

function list(query, cb) {
  cb = cb || query; // fields is optional

  var filter = {};
  var fields = parser(query.fields);
  var options = {
    skip: query.skip,
    limit: query.limit,
    sort: parser(query.sort)
  };

  Meeting.find(filter,fields,options, function(err, meetings) {
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