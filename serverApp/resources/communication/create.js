var Communication = require('./../../db/models/communication.js');
var notification  = require('./../notification');

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
      notification.notify(communication.member, communication.thread, 'posted a new communication', newCommunication._id);

      reply({success: "Communication created."});
    }
  });

}
