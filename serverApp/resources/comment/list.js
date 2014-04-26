var async          = require('async');
var Comment        = require('./../../db/models/comment.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var comments;

  async.series([
      getComments,
    ], done);

  function getComments(cb) {
    Comment.findAll(gotComments);

    function gotComments(err, result) {
      if (err) cb(err);
      comments = result;
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