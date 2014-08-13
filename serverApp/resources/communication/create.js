var Communication = require('./../../db/models/communication.js');
var Member        = require('./../member');
var notification  = require('./../notification');
var async         = require('async');

module.exports = create;

function create(request, reply) {

  var communication = request.payload;
  if(communication.kind === 'Email To' || communication.kind=== 'Inital Email Paragraph'){
    communication.approved = false;
  }

  communication.member = request.auth.credentials.id;

  var newCommunication = new Communication(communication);

  newCommunication.save(function (err){
    if (err) {
      reply({error: "Error creating communication."});
    }
    else {
      Member.getTargetsByThread(communication.thread, function(err, targets) {
        if(err) { console.log(err); }
        Member.getByRole({params: {id: 'coordination'}}, function(result){
          if(result.error){
            console.log(result.error);
          }
          else{
            async.each(result, function(member, memberDone){
              if(targets.indexOf(member.id) == -1){
                targets.push(member.id);
              }
              memberDone();
            }, function(){
              notification.notify(communication.member, communication.thread, 'posted a new communication', newCommunication._id, targets);
            });
          }
        });
      });

      reply({success: "Communication created."});
    }
  });

}
