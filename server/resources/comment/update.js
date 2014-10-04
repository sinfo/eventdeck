var async    = require('async');
var Comment  = require('../../db/models/comment.js');
var markdown = require('markdown').markdown;
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {

  var comment = request.payload;

  var savedComment;

  async.series([
    getComment,
    checkPermission,
    saveComment
  ], done);

  function getComment(cb) {
    Comment.findById(request.params.id, gotComment);

    function gotComment(err, result) {
      if (err) {
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find the comment.');
      }
      
      savedComment = result[0];
      comment.updated = Date.now();
      cb();
    }
  }

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length === 0 && savedComment.member != request.auth.credentials.id) {
      return cb('You don\'t have permissions for this.');
    }
    
    cb();
  }

  function saveComment(cb) {
    if (savedComment.member != request.auth.credentials.id) {
      return cb('You\'re not the author.');
    }

    comment.html = markdown.toHTML(request.payload.markdown);

    Comment.update({_id: request.params.id}, comment, function(err) {
      if (err) {
        return cb(err);
      }
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] error updating comment');
      return reply({error: 'There was an error updating the comment.'});
    }
    
    log.info('[comment] %s updated a comment on %s', request.auth.credentials.id, savedComment.thread);
  
    reply({success: 'Comment updated.'});
  }
}
