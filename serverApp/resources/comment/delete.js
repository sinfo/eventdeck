var async = require('async');
var Comment = require('./../../db/models/comment.js');
var Notification = require('./../../db/models/notification.js');
var log = require('../../helpers/logger');

module.exports = remove;

function remove(request, reply) {  

  var savedComment;

  async.series([
    getComment,
    checkPermission,
    deleteComment
  ], done);

  function getComment(cb) {
    Comment.findById(request.params.id, gotComment);

    function gotComment(err, result) {
      if (err) {
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find the comment with id '+ request.params.id);
      }

      savedComment = result[0];
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

  function deleteComment(cb) {
    Comment.del(request.params.id, function(err) {
      if (err) {
        return cb(err);
      }

      Notification.removeBySource(request.params.id, function (err) {
        if(err) { 
          return cb(err); 
        }

        cb();
      });
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[comment] error deleting comment');
      return reply({error: 'Error deleting comment'});
    }
    
    log.info('[comment] %s deleted a comment on %s', request.auth.credentials.id, savedComment.thread);

    reply({success: 'Comment deleted.'});
  }
}
