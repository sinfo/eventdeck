var Communication = require('../../db/models/communication.js');
var Member        = require('../member');
var notification  = require('../notification');
var async         = require('async');
var log           = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var communication = request.payload;
  
  communication.status = 'pending-review';
  communication.member = request.auth.credentials.id;

  var newCommunication = new Communication(communication);

  newCommunication.save(function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[communication] error creating communication');
      return reply({error: 'Error creating communication.'});
    }

    Member.getTargetsByThread(communication.thread, function(err, targets) {
      if(err) { 
        log.error({err: err, username: request.auth.credentials.id}, '[communication] error getting targets for %s', communication.thread); 
      }

      Member.getByRole({params: {id: 'coordination'}}, function(result){
        if(result.error){
          return log.error({err: result.error, username: request.auth.credentials.id}, '[communication] error getting targets for %s', communication.thread);
        }

        async.each(result, function(member, memberDone){
          if(targets.indexOf(member.id) == -1){
            targets.push(member.id);
          }
          memberDone();
        }, function(){
          notification.notify(communication.member, communication.thread, 'posted a new communication', newCommunication._id, targets);
        });
      });
    });

    log.info('[communication] %s created new communication on %s', request.auth.credentials.id, communication.thread);

    reply({success: 'Communication created.'});
    
  });

}
