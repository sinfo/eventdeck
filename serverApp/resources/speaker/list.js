var async          = require('async');
var Speaker        = require('./../../db/models/speaker.js');
var Hapi           = require('hapi');

module.exports = list;

function list(request, reply) {

  var companies;

  async.series([
      getSpeakers,
    ], done);

  function getSpeakers(cb) {
    Speaker.findAll(gotSpeakers);

    function gotSpeakers(err, result) {
      if (err) cb(err);
      companies = result;
      cb();
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(companies);
    }
  }
}