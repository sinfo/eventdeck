var Session = require('../../db/models/session');
var notification  = require('../notification');

module.exports = create;

function create(request, reply) {

  var session = request.payload;

  session.member = request.auth.credentials.id;

  var newSession = new Session(session);

  newSession.save(function (err){
    if (err) {
      console.log('Error creating session.');
      return reply({error: 'Error creating session.'});
    }

    notification.notify(request.auth.credentials.id, 'session-'+session.id, 'created a new session', null);

    reply({success: 'Session created.'});
  });

}
