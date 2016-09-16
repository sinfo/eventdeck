/* global app */
var AmpCollection = require('ampersand-rest-collection')
var session = require('./session')

module.exports = AmpCollection.extend({
  model: session,
  url: '/api/sessions',
  initialize: function () {
    this.url = '/api/sessions?event=' + app.me.selectedEvent
  },
  update: function () {
    this.url = '/api/sessions?event=' + app.me.selectedEvent
  }
})
