var async    = require('async');
var Communication  = require('./../../db/models/communication.js');

module.exports = create;

function create(request, reply) {

  var communication = request.payload;

  var savedCommunication;

  async.series([
    getCommunication,
    saveCommunication
  ], done);

  function getCommunication(cb) {
    Communication.findById(request.params.id, gotCommunication);

    function gotCommunication(err, result) {
      if (err) {
        cb(err);
      }
      else if (result && result.length > 0) {
        savedCommunication = result[0];
        communication.updated = Date.now();
        cb();
      }
      else {
        cb("Could not find the communication.");
      }
    }
  }

  function saveCommunication(cb) {
    if (savedCommunication.member == request.auth.credentials.id) {
      return cb("You cannot approve your own stuff.");
    }

    Communication.update({_id: request.params.id}, {approved: true}, function(err) {
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
      reply({error: "There was an error approving the communication."});
    }
    else {
      reply({success: "Communication approved."});
    }
  }
}
