var async        = require('async');
var Speaker      = require('./../../db/models/speaker.js');
var notification = require('./../notification');

module.exports = create;

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
      else if (result && result.length > 0) {
        speaker = result[0];
        cb();
      }
      else {
        cb("Could not find speaker with id '" + speakerId + "'.");
      }
    }
  }

  function updateSpeaker(cb) {
    if (request.payload.id != speaker.id)                   { diffSpeaker.id          = request.payload.id; }
    if (request.payload.name != speaker.name)               { diffSpeaker.name        = request.payload.name; }
    if (request.payload.img != speaker.img)                 { diffSpeaker.img         = request.payload.img; }
    if (request.payload.description != speaker.description) { diffSpeaker.description = request.payload.description; }
    if (request.payload.status != speaker.status)           { diffSpeaker.status      = request.payload.status; }
    if (request.payload.contacts != speaker.contacts)       { diffSpeaker.contacts    = request.payload.contacts; }
    if (request.payload.forum != speaker.forum)             { diffSpeaker.forum       = request.payload.forum; }
    if (request.payload.member != speaker.member)           { diffSpeaker.member      = request.payload.member; }
    if (request.payload.paragraph != speaker.paragraph)     { diffSpeaker.paragraph   = request.payload.paragraph; }

    if (isEmpty(diffSpeaker)) {
      cb("Nothing changed.");
    }
    else {
      diffSpeaker.updated = Date.now();
      cb();
    }
  }

  function saveSpeaker(cb) {
    Speaker.update({id: speaker.id}, diffSpeaker, function (err) {
      if (err) {
        cb(err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      console.log(err);
      
      if (err === "Nothing changed.") {
        reply({error: "Nothing changed."})
      }
      else {
        reply({error: "There was an error updating the speaker."});
      }
    }
    else {
      notification.notify(request.auth.credentials.id, 'speaker-'+speaker.id, 'updated '+getEditionString(diffSpeaker), null);
      
      reply({success: "Speaker updated."});
    }
  }
}

function getEditionString(diffObject) {
  var editionsArray = [];
  for(var propertyName in diffObject) {
    if(propertyName != "updated"){
      editionsArray.push(propertyName);
    }
  }
  var editions = editionsArray[0];
  if(editionsArray.length > 1){
    editions = editionsArray.slice(0, -1).join(', ')+ ' and ' +editionsArray[editionsArray.length -1];
  }

  return editions;
}

function isEmpty(o) {
  for (key in o)
    return false;
  return true;
}
