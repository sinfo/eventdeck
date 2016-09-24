/* global app */
var PageView = require('../base')
var templates = require('../../templates')
var SessionForm = require('../../forms/session')
var _ = require('../../helpers/underscore')

module.exports = PageView.extend({
  pageTitle: 'Add session',
  template: templates.pages.sessions.add,
  subviews: {
    form: {
      container: 'form',
      prepareView: function (el) {
        return new SessionForm({
          el: el,
          submitCallback: function (data) {
            data = _.compactObject(data)

            if (data.event) {
              console.log(data.event)

              data.event = app.events.find(function (s) { return s.name === data.event }).id
            }

            if (data['session-date']) {
              data.date = data['session-date']
              delete data['session-date']

              if (data['session-date-hours']) {
                data.date.setHours(data['session-date-hours'])
                delete data['session-date-hours']
              }
              if (data['session-date-minutes']) {
                data.date.setMinutes(data['session-date-minutes'])
                delete data['session-date-minutes']
              }
            }

            if (data['session-end']) {
              data.end = data['session-end']
              delete data['session-end']

              if (data['session-end-hours']) {
                data.end.setHours(data['session-end-hours'])
                delete data['session-end-hours']
              }
              if (data['session-end-minutes']) {
                data.end.setMinutes(data['session-end-minutes'])
                delete data['session-end-minutes']
              }
            }

            if (data['tickets.needed'] === true) {
              data.tickets = {
                needed: false,
                start: data.date,
                end: data.date,
                max: 0
              }

              if (data['tickets.start']) {
                data.tickets.start = data['tickets.start']
                delete data['tickets.start']
              }

              if (data['tickets.end']) {
                data.tickets.end = data['tickets.end']
                delete data['tickets.end']
              }

              if (data['tickets.max']) {
                data.tickets.max = parseInt(data['tickets.max'])
                delete data['tickets.max']
              }

              data.tickets.needed = true
              delete data['tickets.needed']
            }

            data.duration = data.end - data.date
            delete data.end

            if (data['session-speakers']) {
              data.speakers = data['session-speakers'] && data['session-speakers'].map(function (s) { return {id: s} })
              delete data['session-speakers']
            }

            app.sessions.create(data, {
              wait: true,
              success: function (model, response, options) {
                app.navigate('/sessions/' + model.id)
                app.sessions.fetch()
              }
            })
          }
        })
      }
    }
  }
})
