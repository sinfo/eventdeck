var async = require('async');
require('./../db');
var Company = require('./../db/models/company.js');

setTimeout(function() {

  console.log('GOGOGOGOG');

  Company.findAll(function (err, companys) {
    console.log(companys.length, 'companys found');

    async.each(companys, function(company, callback) {
      
      var participations = company.participations;

      var newParticipation = {
        event: 'xxi-sinfo',
        member: company.member,
        status: company.status,
      };

      var found = false;
      for(var p in participations) {
        if(participations[p].event == newParticipation.event) {
          //participations[p] = newParticipation;
          found = true;
        }
      }

      if(!found) {
        participations.push(newParticipation);
      }

      Company.update({id: company.id}, {participations: participations}, function (err) {
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