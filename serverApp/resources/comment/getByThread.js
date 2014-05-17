var async          = require('async');
var Comment        = require('./../../db/models/comment.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var threadId;
  var comments;

  if(request.path.indexOf('/api/company/') != -1) {
    threadId = 'company-'+request.params.id;
  }
  else if(request.path.indexOf('/api/speaker/') != -1) {
    threadId = 'speaker-'+request.params.id;
  }
  else if(request.path.indexOf('/api/topic/') != -1) {
    threadId = 'topic-'+request.params.id;
  }

  async.series([
      getComments,
    ], done);

  function getComments(cb) {
    Comment.findByThread(threadId, gotComments);

    function gotComments(err, result) {
      if (err) cb(err);
      comments = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(comments);
    }
  }
}