var async    = require('async');
var Event  = require('../../db/models/event');
var notification  = require('../notification');

module.exports = update;

function update(request, reply) {

  var event = request.payload;

  var savedEvent;

  async.series([
    getEvent,
    saveEvent
  ], done);

  function getEvent(cb) {
    Event.findById(request.params.id, gotEvent);

    function gotEvent(err, result) {
      if (err || !result || result.length < 1) {
        return cb(err);
      }
      
      savedEvent = result[0];
      event.updated = Date.now();
      cb();
    }
  }

  function saveEvent(cb) {
    Event.update({id: request.params.id}, event, function(err) {
      if (err) {
        return cb(err);
      }
   
      cb();
    });
  }

  function done(err) {
    if (err) {
      return reply({error: 'There was an error updating the event.'});
    }

    notification.notify(request.auth.credentials.id, 'event-'+event.id, 'updated an event', null);

    reply({success: 'Event updated.'});
  }
}
