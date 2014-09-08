var Event = require('../../db/models/event');
var notification  = require('../notification');

module.exports = create;

function create(request, reply) {

  var event = request.payload;

  event.member = request.auth.credentials.id;

  var newEvent = new Event(event);

  newEvent.save(function (err){
    if (err) {
      console.log('Error creating event.');
      return reply({error: 'Error creating event.'});
    }
    
    notification.notify(request.auth.credentials.id, 'event-'+event.id, 'created a new event', null);

    reply({success: 'Event created.'});
  });

}
