var async    = require('async');
var Comment  = require('./../../db/models/comment.js');
var markdown = require( "markdown" ).markdown;

module.exports = create;

function create(request, reply) {

  var comment = request.payload;

  var savedComment;

  async.series([
    getComment,
    saveComment
  ], done);

  function getComment(cb) {
    Comment.findById(request.params.id, gotComment);

    function gotComment(err, result) {
      if (!err && result && result.length > 0) {
        savedComment = result[0];
        comment.updated = Date.now();
        cb();
      }
      else {
        cb(err);
      }
    }
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
