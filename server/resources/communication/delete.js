var async = require('async');
var Communication = require('../../db/models/communication.js');
var Notification = require('../../db/models/notification.js');
var log = require('../../helpers/logger');

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
        return cb(err);
      }
      if (!result || result.length < 1) {
        return cb('Could not find the communication with id '+request.params.id);
      }

      savedCommunication = result[0];
      cb();
    }
  }

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length === 0 && savedCommunication.member != request.auth.credentials.id) {
      return cb('You don\'t have permissions for this.');
    }
    
    cb();
  }

  function deleteCommunication(cb) {
    Communication.del(request.params.id, function(err) {
      if (err) {
        return cb('Error on the database');
      }

      Notification.removeBySource(request.params.id, function (err) {
        if(err) { 
          return cb(err); 
        }

        cb();
      });
    });
  }

  function done(err) {
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] error deleting communication');
      return reply({error: 'Error deleting communication'});
    }
    
    log.info('[communication] %s deleted a communication on %s', request.auth.credentials.id, savedCommunication.thread);
    reply({success: 'Communication deleted.'}); 
  }
}
