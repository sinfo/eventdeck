var Hapi           = require('hapi');
var async          = require('async');
var Speaker        = require('./../../db/models/speaker.js');

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
    if(request.payload.id) {
      Speaker.findById(request.payload.id, function(err, speaker) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (speaker.length > 0) {
          return cb(Hapi.error.conflict('Speaker ID exists: '+request.payload.id));
        } else {
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createSpeaker(cb) {
    speaker.id   = request.payload.id;
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
        cb();
      } else { // same id
        return cb(Hapi.error.conflict('Speaker ID exists: '+request.payload.id));
      }
      cb();
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      reply({message:"Speaker Updated!"});
    }
  }
}
