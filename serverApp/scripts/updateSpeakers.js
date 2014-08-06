var async = require('async');
require('./../db');
var Speaker = require('./../db/models/speaker.js');

setTimeout(function() {

  console.log('GOGOGOGOG');

  Speaker.findAll(function (err, speakers) {
    console.log(speakers.length, 'speakers found');

    async.each(speakers, function(speaker, callback) {
      
      var participations = speaker.participations;

      var newParticipation = {
        event: 'xxii-sinfo',
        member: speaker.member,
        status: speaker.status,
      }

      var found = false;
      for(var p in participations) {
        if(participations[p].event == newParticipation.event) {
          participations[p] = newParticipation;
          found = true;
        }
      }

      if(!found) {
        participations.push(newParticipation);
      }

      Speaker.update({id: speaker.id}, {participations: participations}, function (err) {
        if (err) {
          return callback(err);
        }
        
        callback();
      });

    
    }, function(error) {
      if(error) { console.log('Error!!', error); }
      console.log('DONE');
    });
  });

}, 3000);