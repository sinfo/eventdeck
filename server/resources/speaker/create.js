var async        = require('async');
var Speaker      = require('../../db/models/speaker');
var notification = require('../notification');
var email        = require('../email').speakerAttribute;
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var speaker = request.payload;

  async.series([
    checkSpeaker,
    saveSpeaker
  ], done);

  function checkSpeaker(cb) {
    if (!speaker.name) {
      return cb('No name specified.');
    }

    speaker.id = createId(request.payload.name);

    Speaker.findById(speaker.id, function (err, result) {
      if (err) {
        return cb(err);
      }
      if (result && result.length > 0) {
        return cb('Speaker id \'' + speaker.id + '\' already exists.');
      }
      
      cb();
    });
  }

  function saveSpeaker(cb) {
    var newSpeaker = new Speaker(speaker);

    newSpeaker.save(cb);
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id, speaker: speaker}, '[speaker] error creating speaker');
      return reply({error: 'There was an error creating the speaker.'});
    }

    var targets = [];
    if(speaker.member){
      if(request.auth.credentials.id != speaker.member){
        targets.push(speaker.member);
        email(speaker.member, speaker);
      }
    }
    notification.notify(request.auth.credentials.id, 'speaker-'+speaker.id, 'created a new speaker', null, targets);

    log.info({username: request.auth.credentials.id, speaker: speaker.id}, '[speaker] new speaker created');
    reply({success: 'Speaker created.', id:speaker.id});
  }
}

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}