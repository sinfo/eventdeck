var Event = require('../../db/models/event');
var notification  = require('../notification');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var event = request.payload;

  event.member = request.auth.credentials.id;

  var newEvent = new Event(event);

  newEvent.save(function (err){
    if (err) {
      log.error({err: err, username: request.auth.credentials.id}, '[event] error creating event');
      return reply({error: 'Error creating event.'});
    }
    
    log.info({username: request.auth.credentials.id}, '[event] created a new event');

    notification.notify(request.auth.credentials.id, 'event-'+event.id, 'created a new event', null);

    reply({success: 'Event created.'});
  });

}
