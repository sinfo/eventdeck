var Hapi    = require('hapi');
var async   = require('async');
var Meeting = require('./../../db/models/meeting');

exports = module.exports = create;

function create(request, reply) {

  console.log(request.payload);

  var meeting = new Meeting(request.payload);

  meeting.save(function (err){
    if (err) {
      console.log("Error creating meeting!\n" + err);
    }
    else {
      //notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, "meeting",request.auth.credentials.name);
      console.log("Meeting created!");
    }
  });
}
