var async         = require('async');
var Communication = require('./../../db/models/communication.js');
var Speaker      = require('./../../db/models/speaker.js');
var notification  = require('./../notification');

module.exports = create;

function create(request, reply) {

  var communication = request.payload;

  var savedCommunication;

  async.series([
    getCommunication,
    checkPermission,
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
        cb('Could not find the communication.');
      }
    }
  }

  function checkPermission(cb) {
    var roles = request.auth.credentials.roles.filter(function(o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if(roles.length == 0) {
      return cb('You don\'t have permissions for this.');
    }

    if (savedCommunication.member == request.auth.credentials.id) {
      return cb('You cannot approve your own stuff.');
    }

    cb();
  }

  function saveCommunication(cb) {
    Communication.update({_id: request.params.id}, {approved: true}, function(err) {
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
      notification.notify(request.auth.credentials.id, savedCommunication.thread, 'approved a communication', savedCommunication._id);

      if(savedCommunication.thread.indexOf('speaker-') != -1 && savedCommunication.kind == 'Inital Email Paragraph') {
        Speaker.update({id: savedCommunication.thread.replace('speaker-','')}, {status: 'Approved'}, function (err) {
          if (err) { console.log(err)}
        });
      }
      
      reply({success: 'Communication approved.'});
    }
  }
}
