var Hapi           = require('hapi');
var async          = require('async');
var Comment        = require('./../../db/models/comment.js');

exports = module.exports = create;

/// create Comment

function create(request, reply) {

  var comment = {};

  async.series([
      //checkComment,
      createComment,
      saveComment,
    ], done);

  function checkComment(cb) {
    if(request.payload.id) {
      Comment.findById(request.payload.id, function(err, comment) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (comment.length > 0) {
          return cb(Hapi.error.conflict('Comment ID exists: '+request.payload.id));
        } else {
          console.log("GOGOGO");
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createComment(cb) {

    console.log("CREATEEE", request.payload);

    comment.member = request.auth.credentials.id;
    
    if (request.payload.id)            { comment.id       = request.payload.id; }
    if (request.payload.thread)        { comment.thread   = request.payload.thread; }
    if (request.payload.member)        { comment.member   = request.payload.member; }
    if (request.payload.markdown)      { comment.markdown = request.payload.markdown; }

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
      console.log("SUCCESS");
      reply({message:"Comment Updated!"});
    }
  }
}