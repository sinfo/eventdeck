var Hapi   = require('hapi');
var async  = require('async');
var Topic  = require('./../../db/models/topic.js');

exports = module.exports = get;

/// get Company

function get(request, reply) {

  var id = request.params.id;
  var topic   = {};

  async.series([
      getTopic,
    ], done);

  function getTopic(cb) {
    Topic.findById(id, gotTopic);

    function gotTopic(err, result) {
      if (err) {
        cb(err);
      }
      if (result && result.length > 0) {
        if (result[0].id)            { topic = result[0]; }
        cb();
      }
      else {
        cb(Hapi.error.conflict('No topic with the ID: ' + id));
      }
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(topic);
    }
  }
}
