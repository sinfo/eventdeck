var async = require('async');
var speakers = require('./speakers');
var Speaker   = require('./../db/models/speaker.js');
require('./../db');

setTimeout(function() {

  async.each(speakers, function(jsonSpeaker, callback) {

    var newSpeaker = {};

    Speaker.findByName(jsonSpeaker.name, function(err, result) {
      if (err) { callback(err); }

      if (result.length == 0) {
        console.log("missing", jsonSpeaker.name);

        var speaker = {};

        speaker.id   = jsonSpeaker.id;
        speaker.name = jsonSpeaker.name;
        if (jsonSpeaker.img)          { speaker.img         = jsonSpeaker.img; }
        if (jsonSpeaker.description)  { speaker.description = jsonSpeaker.description; }
        if (jsonSpeaker.status)       { speaker.status      = jsonSpeaker.status; }
        if (jsonSpeaker.contacts)     { speaker.contacts    = jsonSpeaker.contacts; }
        if (jsonSpeaker.forum["22"])  { speaker.forum       = jsonSpeaker.forum["22"]; }
        if (jsonSpeaker.status["22"]) { speaker.status      = jsonSpeaker.status["22"]; }
        if (jsonSpeaker.member["22"]) { speaker.member      = jsonSpeaker.member["22"]; }
        
        var newSpeaker = new Speaker(speaker);

        newSpeaker.save(function (err, reply){
          if (err) {
            console.log("ERROR",('Hipcup on the DB' + err.detail));
          } else if(reply) {
            console.log("SUCCESS", speaker);
          } else { // same id        
            console.log("ERROR",('Speaker ID exists: '+request.payload.id));
          }

          callback();
        });
      } else {
        //console.log("found", result[0].name);
        callback();
      }
    });
}, function(error) {
  if(error) { console.log("Error!!", error); }
  console.log("DONE");
});

}, 3000);