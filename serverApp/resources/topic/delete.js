var async          = require('async');
var Topic          = require('./../../db/models/topic.js');
var Hapi           = require('hapi');
var Notification   = require('./../../db/models/notification.js');
var Comment        = require('./../../db/models/comment.js');

module.exports = del;

function del(request, reply) {

  var id = request.params.id;

  async.series([
      delTopic,
    ], done);

  function delTopic(cb) {
    Topic.del(id, deletedTopic);

    function deletedTopic(err, result) {
      if (err) cb(err);

      Notification.removeByThread('topic-'+id, function(err, result) {
        console.log("Notifications removed", result);

      });
      
      Comment.removeByThread('topic-'+id, function(err, result) {
        console.log("Comments removed", result);
      });

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