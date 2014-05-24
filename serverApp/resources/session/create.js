var Session = require('./../../db/models/session.js');
var notification  = require('./../notification');

module.exports = create;

function create(request, reply) {

  var session = request.payload;

  session.member = request.auth.credentials.id;

  var newSession = new Session(session);

  newSession.save(function (err, reply){
    if (err) {
      console.log("Error creating session.");
      reply({error: "Error creating session."});
    }
    else {
      //notification.session(session.member, session.thread, request.auth.credentials.name);

      reply({success: "Session created."});
    }
  });

}
