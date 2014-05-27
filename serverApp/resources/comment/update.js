var async    = require('async');
var Comment  = require('./../../db/models/comment.js');
var markdown = require( "markdown" ).markdown;

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
        cb(err);
      }
      else if (result && result.length > 0) {
        savedComment = result[0];
        comment.updated = Date.now();
        cb();
      }
      else {
        cb("Could not find the comment.");
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

  function saveComment(cb) {
    if (savedComment.member != request.auth.credentials.id) {
      return cb("You're not the author.");
    }

    comment.html = markdown.toHTML(request.payload.markdown);

    Comment.update({_id: request.params.id}, comment, function(err) {
      if (err) {
        cb(err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: "There was an error updating the comment."});
    }
    else {
      reply({success: "Comment updated."});
    }
  }
}
