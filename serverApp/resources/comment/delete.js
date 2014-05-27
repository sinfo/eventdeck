var async = require('async');
var Comment = require('./../../db/models/comment.js');

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
        cb(err);
      }
      else if (result && result.length > 0) {
        savedComment = result[0];
        cb();
      }
      else {
        cb('Could not find the comment.');
      }
    }
  }

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length == 0 && savedComment.member != request.auth.credentials.id) {
      return cb('You don\'t have permissions for this.');
    }
    
    cb();
  }

  function deleteComment(cb) {
    Comment.del(request.params.id, function(err) {
      if (err) {
        cb('Error on the database');
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: err});
    }
    else {
      reply({success: 'Comment deleted.'});
    }
  }
}
