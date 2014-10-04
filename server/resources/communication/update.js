var async = require('async');
var Communication  = require('./../../db/models/communication.js');
var notification  = require('./../notification');
var log = require('../../helpers/logger');

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
      if (err || !result || result.length < 1) {
        return cb(err || 'error getting communication');
      }

      savedCommunication = result[0];
      communication.updated = Date.now();
      cb();
    }
  }

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(communication.status != savedCommunication.status) {
      if(roles.length === 0) {
        delete(communication.status);
        return cb('You\'re not allowed to approve or review communications');
      }
      notificationText = 'changed communication status';
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
      log.error({err: err, username: request.auth.credentials.id}, '[communication] error updating communication');
      return reply({error: 'There was an error updating the communication.'});
    }
    
    log.info('[communication] %s updated a communication on %s', request.auth.credentials.id, savedCommunication.thread);
  
    notification.notify(request.auth.credentials.id, savedCommunication.thread, notificationText, savedCommunication._id, [savedCommunication.member]);
    
    reply({success: 'Communication updated.'});
  }
}
