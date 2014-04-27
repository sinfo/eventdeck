var Hapi           = require('hapi');
var async          = require('async');
var Comment        = require('./../../db/models/comment.js');
var markdown       = require( "markdown" ).markdown;

exports = module.exports = create;

/// create Comment

function create(request, reply) {

  var commentId = request.params.id;
  var comment = {};
  var diffComment = {};

  async.series([
      getComment,
      updateComment,
      saveComment,
    ], done);

  function getComment(cb) {
    Comment.findById(commentId, gotComment);

    function gotComment(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        if (result[0]._id)      { comment._id      = result[0]._id; }
        if (result[0].thread)   { comment.thread   = result[0].thread; }
        if (result[0].member)   { comment.member   = result[0].member; }
        if (result[0].markdown) { comment.markdown = result[0].markdown; }

        comment.updated = Date.now();
    
        cb();
      }
      else {
        cb(Hapi.error.conflict('No comment with the ID: ' + commentId));
      }
    }
  }

  function updateComment(cb) {
    console.log(request.payload.member, comment.member, request.payload.member != comment.member)

    if (request.payload.thread   != comment.thread)   { diffComment.thread   = request.payload.thread; }
    if (request.payload.member   != comment.member)   { diffComment.member   = request.payload.member; }
    if (request.payload.markdown != comment.markdown) { diffComment.markdown = request.payload.markdown; 
                                                        diffComment.html     = markdown.toHTML(request.payload.markdown); }
    if (request.payload.updated  != comment.updated)  { diffComment.updated  = request.payload.updated; }

    console.log("DIFF", diffComment)

    cb();
  }

  function saveComment(cb) {
    if(comment.member != request.auth.credentials.id) {
      return cb("You're not the author");
    }

    var query = {
      _id: comment._id
    };
    Comment.update(query, diffComment, {}, function (err, numAffected){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      }

      console.log("UPDATED", numAffected)
      cb();
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      reply({message:"Comment Updated!"});
    }
  }
}