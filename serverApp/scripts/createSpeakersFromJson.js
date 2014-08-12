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
        // console.log('missing', jsonSpeaker.name);

        // var speaker = {};

        // speaker.id   = jsonSpeaker.id;
        // speaker.name = jsonSpeaker.name;
        // if (jsonSpeaker.img)          { speaker.img            = jsonSpeaker.img; }
        // if (jsonSpeaker.description)  { speaker.description    = jsonSpeaker.description; }
        // if (jsonSpeaker.status)       { speaker.status         = jsonSpeaker.status; }
        // if (jsonSpeaker.contacts)     { speaker.contacts       = jsonSpeaker.contacts; }
        // if (jsonSpeaker.participation){ speaker.participations = [jsonSpeaker.participation]; }
        
        // var newSpeaker = new Speaker(speaker);

        // newSpeaker.save(function (err, reply){
        //   if (err) {
        //     console.log('ERROR',('Hipcup on the DB' + err.detail));
        //   } else if(reply) {
        //     console.log('SUCCESS', speaker);
        //   } else { // same id        
        //     console.log('ERROR',('Speaker ID exists'));
        //   }

        //   callback();
        // });
        callback();
      } else if(result.length == 1) {

        var speaker = {};
        if (!result[0].img && jsonSpeaker.img)                  { speaker.img            = jsonSpeaker.img; }
        if (!result[0].description && jsonSpeaker.description)  { speaker.description    = jsonSpeaker.description; }
        if (!result[0].status && jsonSpeaker.status)            { speaker.status         = jsonSpeaker.status; }
        if (!result[0].contacts && jsonSpeaker.contacts)        { speaker.contacts       = jsonSpeaker.contacts; }

        speaker.participations = result[0].participations || [];
        speaker.participations.push(jsonSpeaker.participation);

        console.log('found', result[0].name, 'update', speaker);
        
        Speaker.update({id: result[0].id}, speaker, function (err) {
          if (err) {
            return callback(err);
          }
          console.log('done');
  
          callback();
        });
      } else {
        callback();
      }

    });
}, function(error) {
  if(error) { console.log('Error!!', error); }
  console.log('DONE');
});

}, 3000);