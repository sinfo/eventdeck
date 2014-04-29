var Hapi           = require('hapi');
var async          = require('async');
var Speaker        = require('./../../db/models/speaker.js');

exports = module.exports = get;

/// get Speaker

function get(request, reply) {

  var speakerId = request.params.id;
  var speaker   = {};

  async.series([
      getSpeaker,
    ], done);

  function getSpeaker(cb) {
    Speaker.findById(speakerId, gotSpeaker);

    function gotSpeaker(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        if (result[0].id)            { speaker.id            = result[0].id; }
        if (result[0].name)          { speaker.name          = result[0].name; }
        if (result[0].img)           { speaker.img           = result[0].img; }
        if (result[0].description)   { speaker.description   = result[0].description; }
        if (result[0].status)        { speaker.status        = result[0].status; }
        if (result[0].contacts)      { speaker.contacts      = result[0].contacts; }
        if (result[0].forum)         { speaker.forum         = result[0].forum; }
        if (result[0].member)        { speaker.member        = result[0].member; }
        if (result[0].updated)       { speaker.updated       = result[0].updated; }
        
        cb();
      }
      else {
        cb(Hapi.error.conflict('No speaker with the ID: ' + speakerId));
      }
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(speaker);
    }
  }
}
