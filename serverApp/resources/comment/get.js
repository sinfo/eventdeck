var async          = require('async');
var Comment        = require('./../../db/models/comment.js');
var Hapi           = require('hapi');

module.exports = get;

function get(request, reply) {

  var id = request.params.id;
  var comment;

  async.series([
      getComment,
    ], done);

  function getComment(cb) {
    Comment.findById(id, gotComment);

    function gotComment(err, result) {
      if (err) cb(err);
      comments = result[0];
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