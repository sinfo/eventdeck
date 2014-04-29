var Hapi        = require('hapi');
var async       = require('async');
var Comment     = require('./../../db/models/comment.js');
var markdown    = require('markdown').markdown;
var email       = require('./../email')

exports = module.exports = create;

/// create Comment

function create(request, reply) {

  var comment = {};

  async.series([
      createComment,
      saveComment,
    ], done);

  function createComment(cb) {

    comment.member = request.auth.credentials.id;
    
    if (request.payload.id)            { comment.id       = request.payload.id; }
    if (request.payload.thread)        { comment.thread   = request.payload.thread; }
    if (request.payload.member)        { comment.member   = request.payload.member; }
    if (request.payload.markdown)      { comment.markdown = request.payload.markdown; 
                                         comment.html     = markdown.toHTML(request.payload.markdown); }

    cb();
  }

  function saveComment(cb) {
    var newComment = new Comment(comment);

    newComment.save(function (err, reply){
      if (err) {
      
      console.log("ERROR", err);
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } 


      cb();
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      email.comment(comment);
      reply({message:"Comment Updated!"});
    }
  }
}