var Session = require('../db/session')
var Icalendar = require('icalendar')
var fs = require('fs')
var config = require('../../config')
var Boom = require('boom')
var log = require('../helpers/logger')

var icalPath = config.ical.path
var ical = {}

ical.generate = function (cb) {
  var ical = new Icalendar.iCalendar() // eslint-disable-line
  var today = new Date()

  Session.find({ date: { $gt: today } }, gotSessions)

  function gotSessions (error, sessions) {
    if (error) {
      log.error({err: error}, 'error fetching sessions')
      return (cb ? cb(Boom.internal()) : Boom.internal())
    }

    sessions.forEach(function (session) {
      var event = new Icalendar.VEvent(session.id)
      event.setSummary(session.name)
      event.setDescription(session.description)
      event.setLocation(session.place)

      if (session.date && session.duration) {
        event.setDate(new Date(session.date.getTime()), new Date(session.date.getTime() + session.duration.getTime()))
      }

      ical.addComponent(event)
    })

    var icalString = ical.toString()
    var icalTokens = icalString.split('BEGIN:VCALENDAR')

    icalString = 'BEGIN:VCALENDAR\nX-WR-CALNAME:SINFO Sessions' + icalTokens[1]

    fs.writeFile(icalPath, icalString, function (err) {
      if (err) {
        log.error({err: err}, 'error writing icalendar')

        return (cb ? cb(Boom.internal()) : Boom.internal())
      }

      if (cb) { cb(null, ical) }
    })
  }
}

module.exports = ical
