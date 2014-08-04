var async = require('async');
require('./../db');
var Speaker = require('./../db/models/speaker.js');

setTimeout(function() {

  console.log('GOGOGOGOG');

  Speaker.findAll(function (err, speakers) {
    console.log(speakers.length, 'speakers found');

    async.each(speakers, function(speaker, callback) {
      
      var participations = [];

      participations.push({
        event: 'xxii-sinfo',
        member: speaker.member,
        status: speaker.status,
      });

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