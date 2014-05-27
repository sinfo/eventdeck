var async = require('async');
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
      if (!err && result && result.length > 0) {
        savedCommunication = result[0];
        communication.updated = Date.now();
        cb();
      }
      else {
        cb(err);
      }
    }
  }

  function saveCommunication(cb) {
    Communication.update({_id: request.params.id}, communication, function(err) {
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
      reply({error: "There was an error updating the communication."});
    }
    else {
      reply({success: "Communication updated."});
    }
  }
}
