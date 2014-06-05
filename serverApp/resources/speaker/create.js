var async        = require('async');
var Speaker      = require('./../../db/models/speaker.js');
var notification = require('./../notification');

module.exports = create;

function create(request, reply) {

  var speaker = request.payload;

  async.series([
    checkSpeaker,
    saveSpeaker
  ], done);

  function checkSpeaker(cb) {
    if (speaker.name) {
      speaker.id = createId(request.payload.name);

      Speaker.findById(speaker.id, function (err, result) {
        if (err) {
          return cb(err);
        }
        else if (result && result.length > 0) {
          return cb("Speaker id '" + speaker.id + "' already exists.");
        }
        else {
          return cb();
        }
      });
    }
    else {
      return cb("No name specified.");
    }
  }

  function saveSpeaker(cb) {
    var newSpeaker = new Speaker(speaker);

    newSpeaker.save(function (err) {
      if (err) {
        return cb(err);
      }
      else {
        return cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: "There was an error creating the speaker."});
    }
    else {
      notification.notify(request.auth.credentials.id, 'speaker-'+speaker.id, 'created a new speaker', null);

      reply({success: "Speaker created.", id:speaker.id});
    }
  }
}

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}
