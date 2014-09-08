var async        = require('async');
var Speaker      = require('../../db/models/speaker');
var notification = require('../notification');
var email        = require('../email').speakerAttribute;

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
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find speaker with id ' + speakerId + '.');
      }

      speaker = result[0];
      cb();
    }
  }

  function updateSpeaker(cb) {
    if (request.payload.id && request.payload.id != speaker.id)                                            { diffSpeaker.id             = request.payload.id; }
    if (request.payload.name && request.payload.name != speaker.name)                                      { diffSpeaker.name           = request.payload.name; }
    if (request.payload.title && request.payload.title != speaker.title)                                   { diffSpeaker.title           = request.payload.title; }
    if (request.payload.img && request.payload.img != speaker.img)                                         { diffSpeaker.img            = request.payload.img; }
    if (request.payload.description && request.payload.description != speaker.description)                 { diffSpeaker.description    = request.payload.description; }
    if (request.payload.status && request.payload.status != speaker.status)                                { diffSpeaker.status         = request.payload.status; }
    if (request.payload.contacts && request.payload.contacts != speaker.contacts)                          { diffSpeaker.contacts       = request.payload.contacts; }
    if (request.payload.forum && request.payload.forum != speaker.forum)                                   { diffSpeaker.forum          = request.payload.forum; }
    if (request.payload.member && request.payload.member != speaker.member)                                { diffSpeaker.member         = request.payload.member; }
    if (request.payload.paragraph && request.payload.paragraph != speaker.paragraph)                       { diffSpeaker.paragraph      = request.payload.paragraph; }
    if (request.payload.participations && !equals(request.payload.participations, speaker.participations)) { diffSpeaker.participations = request.payload.participations; }

    if (isEmpty(diffSpeaker)) {
      cb('Nothing changed.');
    }
    else {
      diffSpeaker.updated = Date.now();
      cb();
    }
  }

  function saveSpeaker(cb) {
    Speaker.update({id: speaker.id}, diffSpeaker, function (err) {
      if (err) {
        return cb(err);
      }
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      console.log(err);
      
      if (err === 'Nothing changed.') {
        return reply({error: 'Nothing changed.'});
      }
      else {
        return reply({error: 'There was an error updating the speaker.'});
      }
    }

    var targets = [];
    var member;
    member = diffSpeaker.member ? diffSpeaker.member : speaker.member;
    if(member){
      if(request.auth.credentials.id !== member) {
        targets.push(member);
        if(diffSpeaker.member){
          targets.push(speaker.member);
        }
        email(member, speaker);
      }
    }
    notification.notify(request.auth.credentials.id, 'speaker-'+speaker.id, 'updated '+getEditionString(diffSpeaker), null, targets);
    
    reply({success: 'Speaker updated.'});
  }
}

function getEditionString(diffObject) {
  var editionsArray = [];
  for(var propertyName in diffObject) {
    if(propertyName != 'updated'){
      editionsArray.push(propertyName);
    }
  }
  var editions = editionsArray[0];
  if(editionsArray.length > 1){
    editions = editionsArray.slice(0, -1).join(', ')+ ' and ' +editionsArray[editionsArray.length -1];
  }

  return editions;
}

function equals(o1, o2) {
  if(o1.length && o2.length && o1.length != o2.length) { return false; } 
  
  if(typeof(o1) != typeof(o2)) { return false; }

  for (var key in o1) {
    var type = typeof(o1[key]);
    if (type == 'object') {
      if (!equals(o1[key], o2[key]))
        return false;
    }
    else{
      if (o1[key] != o2[key])
        return false;
    }
  }

  return true;
}

function isEmpty(o) {
  for (var key in o) {
    return false;
  }
  return true;
}
