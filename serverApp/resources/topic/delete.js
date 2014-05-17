var async          = require('async');
var Topic        = require('./../../db/models/topic.js');
var Hapi           = require('hapi');

module.exports = del;

function del(request, reply) {

  var id = request.params.id;
  var topics;

  async.series([
      delTopic,
    ], done);

  function delTopic(cb) {
    Topic.del(id, deletedTopic);

    function deletedTopic(err, result) {
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