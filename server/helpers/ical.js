var Session = require('server/db/session');
var icalendar = require('icalendar');
var fs = require('fs');
var config = require('config');
var Boom = require('boom');
var log = require('server/helpers/logger');

var icalPath = config.ical.path;
var ical = {};

ical.generate = function (cb) {
  var ical = new icalendar.iCalendar();

  Session.find({}, gotSessions);

  function gotSessions(error, sessions) {
    if (error) {
      log.error({err: error}, 'error fetching sessions');
      return (cb ? cb(Boom.internal()) : Boom.internal()); 
    }

    sessions.forEach(function (session) {
      var event = new icalendar.VEvent(session.id);
      event.setSummary(session.name);
      event.setDescription(session.description);
      event.setLocation(session.place);
      
      if(session.date && session.duration) {
        event.setDate(new Date(session.date.getTime()), new Date(session.date.getTime() + session.duration.getTime()));
      }

      ical.addComponent(event);
    });

    fs.writeFile(icalPath, ical.toString(), function (err) {
      if (err) {
        log.error({ err: err}, 'error writing icalendar');

      return (cb ? cb(Boom.internal()) : Boom.internal()); 
      }
      
      if (cb) {cb(null, ical); }
    });
  }
};

module.exports = ical;