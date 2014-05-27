var async = require('async');
var Communication = require('./../../db/models/communication.js');

module.exports = remove;

function remove(request, reply) {  

  var savedCommunication;

  async.series([
    getCommunication,
    checkPermission,
    deleteCommunication
  ], done);

  function getCommunication(cb) {
    Communication.findById(request.params.id, gotCommunication);

    function gotCommunication(err, result) {
      if (err) {
        cb(err);
      }
      else if (result && result.length > 0) {
        savedCommunication = result[0];
        cb();
      }
      else {
        cb('Could not find the communication.');
      }
    }
  }

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length == 0 && savedCommunication.member != request.auth.credentials.id) {
      return cb('You don\'t have permissions for this.');
    }
    
    cb();
  }

  function deleteCommunication(cb) {
    Communication.del(request.params.id, function(err) {
      if (err) {
        cb('Error on the database');
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: err});
    }
    else {
      reply({success: 'Communication deleted.'});
    }
  }
}
