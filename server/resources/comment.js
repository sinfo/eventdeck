var Boom = require('boom');
var server = require('server').hapi;
var log = require('server/helpers/logger');
var threadFromPath = require('server/helpers/threadFromPath');
var Comment = require('server/db/models/comment');


server.method('comment.create', create, {});
server.method('comment.update', update, {});
server.method('comment.get', get, {});
server.method('comment.getByMember', getByMember, {});
server.method('comment.getByThread', getByThread, {});
server.method('comment.list', list, {});
server.method('comment.remove', remove, {});


function create(comment, memberId, cb) {
  comment.member = memberId;
  comment.posted = Date.now();
  comment.updated = Date.now();

  Comment.create(comment, function(err, _comment) {
    if (err) {
      log.error({ err: err, comment: comment}, 'error creating comment');
      return cb(Boom.internal());
    }

    cb(_comment);
  });
};

function update(id, comment, cb) {
  comment.updated = Date.now();
  var filter = {_id: id};

  Comment.findOneAndUpdate(filter, comment, function(err, _comment) {
    if (err) {
      log.error({ err: err, comment: id}, 'error updating comment');
      return cb(Boom.internal());
    }
    if (!_comment) {
      log.warn({ err: 'not found', comment: id}, 'error updating comment');
      return cb(Boom.notFound());
    }

    cb(_comment);
  });
};

function get(id, cb) {
  var filter ={_id: id};

  Comment.findOne(filter, function(err, comment) {
    if (err) {
      log.error({ err: err, comment: id}, 'error getting comment');
      return cb(Boom.internal());
    }
    if (!comment) {
      log.warn({ err: 'not found', comment: id}, 'error getting comment');
      return cb(Boom.notFound());
    }

    cb(comment);
  });
};

function getByMember(memberId, cb) {
  var filter ={member:memberId};

  Comment.find(filter, function(err, comments) {
    if (err) {
      log.error({ err: err, member: memberId}, 'error getting comments');
      return cb(Boom.internal());
    }

    cb(comments);
  });
};

function getByThread(path, id, cb) {
  var thread = threadFromPath(path, id);
  var filter = {thread:thread};
  Comment.find(filter, function(err, comments) {
    if (err) {
      log.error({ err: err, thread: thread}, 'error getting comments');
      return cb(Boom.internal());
    }

    cb(comments);
  });
};

function list(cb) {
  Comment.find({}, function(err, comments) {
    if (err) {
      log.error({ err: err}, 'error getting all comments');
      return cb(Boom.internal());
    }
    
    cb(comments);
  });
};

function remove(id, cb) {
  var filter = {_id:id};

  Comment.findOneAndRemove(filter, function(err, comment){
    if (err) {
      log.error({ err: err, comment: id}, 'error deleting comment');
      return cb(Boom.internal());
    }
    if (!comment) {
      log.error({ err: err, comment: id}, 'error deleting comment');
      return cb(Boom.notFound());
    }

    return cb(comment);
  });
};