var Hapi  = require('hapi');
var async = require('async');

exports = module.exports = create;

function create(request, reply) {

  var meeting = {};

  async.series([
      checkMeeting,
      createMeeting,
      saveMeeting,
    ], done);

  function checkMeeting(cb) {
    if(request.payload.id) {
      Meeting.findById(request.payload.id, function(err, meeting) {
        if (err) {
          return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
        } else if (meeting.length > 0) {
          return cb(Hapi.error.conflict('Meeting ID exists: '+request.payload.id));
        } else {
          return cb();
        }
      });
    } else {
      return cb(Hapi.error.conflict('You need to specify an Id'));
    }
  }

  function createMeeting(cb) {
    meeting.id   = request.payload.id;
    meeting.name = request.payload.name;
    if (request.payload.img)           { meeting.img           = request.payload.img; }
    if (request.payload.description)   { meeting.description   = request.payload.description; }
    if (request.payload.status)        { meeting.status        = request.payload.status; }
    if (request.payload.contacts)      { meeting.contacts      = request.payload.contacts; }
    if (request.payload.forum)         { meeting.forum         = request.payload.forum; }
    if (request.payload.member)        { meeting.member        = request.payload.member; }
    if (request.payload.paragraph)     { meeting.paragraph     = request.payload.paragraph; }

    cb();
  }

  function saveMeeting(cb) {
    var newMeeting = new Meeting(meeting);

    newMeeting.save(function (err, reply){
      if (err) {
        return cb(Hapi.error.internal('Hipcup on the DB' + err.detail));
      } else if(reply) {
        return cb();
      } else { // same id
        return cb(Hapi.error.conflict('Meeting ID exists: '+request.payload.id));
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error:"There was an error!"});
    } else {
      notification.new(request.auth.credentials.id, 'meeting-'+meeting.id, meeting.name, "meeting",request.auth.credentials.name);
      reply({message:"Meeting Updated!"});
    }
  }
}
