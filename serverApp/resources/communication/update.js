var async = require('async');
var Communication  = require('./../../db/models/communication.js');
var notification  = require('./../notification');

module.exports = update;

function update(request, reply) {

  var communication = request.payload;

  var savedCommunication;

  var notificationText = 'updated a communication';

  async.series([
    getCommunication,
    checkPermission,
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

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(communication.status != savedCommunication.status) {
      if(roles.length == 0) {
        delete(communication.status);
        return cb('You\'re not allowed to approve or review communications');
      }
      notificationText = 'changed communication status'
    }

    cb();
  }

  function saveCommunication(cb) {
    Communication.update({_id: request.params.id}, communication, function(err) {
      if (err) {
        return cb(err);
      }
      
      cb();
    });
  }

  function done(err) {
    if (err) {
      return reply({error: "There was an error updating the communication."});
    }
    
    notification.notify(request.auth.credentials.id, savedCommunication.thread, notificationText, savedCommunication._id, [savedCommunication.member]);
    
    reply({success: 'Communication updated.'});
  }
}
