var Hapi           = require('hapi');
var async          = require('async');
var Speaker        = require('./../../db/models/speaker.js');
var notification  = require('./../notification');

exports = module.exports = create;

/// create Speaker

function create(request, reply) {

  var speaker = {};

  async.series([
      checkSpeaker,
      createSpeaker,
      saveSpeaker,
    ], done);

  function checkSpeaker(cb) {
    if(request.payload.name) {
      Speaker.findById(createId(request.payload.name), function(err, speaker) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (speaker.length > 0) {
          return cb(Hapi.error.conflict('Speaker ID exists: '+createId(request.payload.name)));
        } else {
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createSpeaker(cb) {
    speaker.id   = createId(request.payload.name);
    speaker.name = request.payload.name;
    if (request.payload.img)           { speaker.img           = request.payload.img; }
    if (request.payload.description)   { speaker.description   = request.payload.description; }
    if (request.payload.status)        { speaker.status        = request.payload.status; }
    if (request.payload.contacts)      { speaker.contacts      = request.payload.contacts; }
    if (request.payload.forum)         { speaker.forum         = request.payload.forum; }
    if (request.payload.member)        { speaker.member        = request.payload.member; }
    if (request.payload.paragraph)     { speaker.paragraph     = request.payload.paragraph; }

    cb();
  }

  function saveSpeaker(cb) {
    var newSpeaker = new Speaker(speaker);

    newSpeaker.save(function (err, reply){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        return cb();
      } else { // same id
        return cb(Hapi.error.conflict('Speaker ID exists: '+speaker.id));
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      notification.new(request.auth.credentials.id, 'speaker-'+speaker.id, speaker.name, "speaker",request.auth.credentials.name);
      reply({message:"Speaker Updated!"});
    }
  }
}

function createId(text) {
  return text.toLowerCase().replace(/ç/g, 'c').replace(/á|à|ã/g, 'a').replace(/é|è|ê/g, 'e').replace(/í|ì|î/g, 'i').replace(/ó|ò|õ|ô/g, 'o').replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '-');
}
