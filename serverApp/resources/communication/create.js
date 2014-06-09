var Communication = require('./../../db/models/communication.js');
var notification  = require('./../notification');
var getTargets   = require('./../member').getTargetsByThread;

module.exports = create;

function create(request, reply) {

  var communication = request.payload;

  communication.member = request.auth.credentials.id;

  var newCommunication = new Communication(communication);

  newCommunication.save(function (err){
    if (err) {
      reply({error: "Error creating communication."});
    }
    else {
      getTargets(communication.thread, function(err, targets) {
        if(err) { console.log(err); }

        notification.notify(communication.member, communication.thread, 'posted a new communication', newCommunication._id, targets);
      });

      reply({success: "Communication created."});
    }
  });

}
