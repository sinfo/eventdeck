var Boom = require('boom');
var slug = require('slug');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var Topic = require('server/db/models/topic');


server.method('topic.create', create, {});
server.method('topic.update', update, {});
server.method('topic.get', get, {});
server.method('topic.getByMember', getByMember, {});
server.method('topic.getByDueDate', getByDueDate, {});
server.method('topic.getByTag', getByTag, {});
server.method('topic.getByMeeting', getByMeeting, {});
server.method('topic.list', list, {});
server.method('topic.remove', remove, {});


function create(topic, memberId, cb) {
  topic.posted = Date.now();
  topic.author = memberId;

  Topic.create(topic, function(err, _topic) {
    if (err) {
      log.error({ err: err, topic: topic}, 'error creating topic');
      return cb(Boom.internal());
    }

    cb(null, _topic);
  });
}

function update(id, topic, cb) {
  topic.updated = Date.now();
  var filter = {_id:id};
  Topic.findOneAndUpdate(filter, topic, function(err, _topic) {
    if (err) {
      log.error({ err: err, topic: id}, 'error updating topic');
      return cb(Boom.internal());
    }
    if (!_topic) {
      log.warn({ err: 'not found', topic: id}, 'error updating topic');
      return cb(Boom.notFound());
    }

    cb(null, _topic);
  });
}

function get(id, cb) {
  var filter = {_id:id};
  Topic.findOne(filter, function(err, topic) {
    if (err) {
      log.error({ err: err, topic: id}, 'error getting topic');
      return cb(Boom.internal());
    }
    if (!topic) {
      log.warn({ err: 'not found', topic: id}, 'error getting topic');
      return cb(Boom.notFound());
    }

    cb(null, topic);
  });
}

function getByMember(memberId, cb) {
  var filter ={targets: {$in: [memberId]}}; 
  Topic.find(filter, function(err, topics) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting topics');
      return cb(Boom.internal());
    }

    cb(null, topics);
  });
}

function getByDueDate(start, end, cb) {
  var filter = {duedate: {$gte: start, $lt: end} };
  Topic.find( filter, function(err, topics) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting topics');
      return cb(Boom.internal());
    }

    cb(null, topics);
  });
}

function getByTag(tagId, cb) {
  var filter = {tags: {$in: [tagId]}};
  Topic.find(filter, function(err, topics) {
    if (err) {
      log.error({ err: err, tag: tagId}, 'error getting topics');
      return cb(Boom.internal());
    }

    cb(null, topics);
  });
}

function getByMeeting(meetingId, cb) {
  var filter = {meetings: {$in: [meetingId]}};
  Topic.find(filter, function(err, topics) {
    if (err) {
      log.error({ err: err, meeting: meetingId}, 'error getting topics');
      return cb(Boom.internal());
    }

    cb(null, topics);
  });
}

function list(cb) {
  Topic.find({}, function(err, topics) {
    if (err) {
      log.error({ err: err}, 'error getting all topics');
      return cb(Boom.internal());
    }
    
    cb(null, topics);
  });
}

function remove(id, cb) {
  var filter = {_id:id};
  Topic.findOneAndRemove(filter, function(err, topic){
    if (err) {
      log.error({ err: err, topic: id}, 'error deleting topic');
      return cb(Boom.internal());
    }
    if (!topic) {
      log.error({ err: err, topic: id}, 'error deleting topic');
      return cb(Boom.notFound());
    }

    return cb(null, topic);
  });
}