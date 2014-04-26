var async          = require('async');
var Comment        = require('./../../db/models/comment.js');
var Hapi           = require('hapi');

module.exports = del;

function del(request, reply) {

  var id = request.params.id;
  var comments;

  async.series([
      delComment,
    ], done);

  function delComment(cb) {
    Comment.del(id, deletedComment);

    function deletedComment(err, result) {
      console.log(err);
      if (err) cb(err);
      console.log(result);
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply();
    }
  }
}