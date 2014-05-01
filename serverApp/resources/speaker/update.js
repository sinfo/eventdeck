var Hapi           = require('hapi');
var async          = require('async');
var Speaker        = require('./../../db/models/speaker.js');

exports = module.exports = create;

/// create Speaker

function create(request, reply) {

  var speakerId = request.params.id;
  var speaker = {};
  var diffSpeaker = {};

  async.series([
      getSpeaker,
      updateSpeaker,
      saveSpeaker,
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
        if (result[0].paragraph)     { speaker.paragraph     = result[0].paragraph; }


        cb();
      }
      else {
        cb(Hapi.error.conflict('No speaker with the ID: ' + speakerId));
      }
    }
  }

  function updateSpeaker(cb) {
    console.log(request.payload.member, speaker.member, request.payload.member != speaker.member)

    if (request.payload.id != speaker.id)                       { diffSpeaker.id            = request.payload.id; }
    if (request.payload.name != speaker.name)                   { diffSpeaker.name          = request.payload.name; }
    if (request.payload.img != speaker.img)                     { diffSpeaker.img           = request.payload.img; }
    if (request.payload.description != speaker.description)     { diffSpeaker.description   = request.payload.description; }
    if (request.payload.status != speaker.status)               { diffSpeaker.status        = request.payload.status; }
    if (request.payload.contacts != speaker.contacts)           { diffSpeaker.contacts      = request.payload.contacts; }
    if (request.payload.forum != speaker.forum)                 { diffSpeaker.forum         = request.payload.forum; }
    if (request.payload.member != speaker.member)               { diffSpeaker.member        = request.payload.member; }
    if (request.payload.paragraph != speaker.paragraph)         { diffSpeaker.paragraph     = request.payload.paragraph; }

    diffSpeaker.updated = Date.now();

    console.log("DIFF", diffSpeaker)

    cb();
  }

  function saveSpeaker(cb) {
    var query = {
      id: speaker.id
    };
    if(diffSpeaker.id) {
      query = speaker;
    }
    Speaker.update(query, diffSpeaker, {}, function (err, numAffected){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      }

      console.log("UPDATED", numAffected)
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
