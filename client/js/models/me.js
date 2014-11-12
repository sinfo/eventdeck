// Me Model - me.js
var Member = require('./member');

module.exports = Member.extend({
  url: '/api/members/me',

  session: {
    selectedEvent: ['string'],
    authenticated: ['boolean']
  },

  derived: {
    selectedEventIndex: {
      deps: ['selectedEvent'],
      fn: function () {
        return app.events.map(function (e) { return e.id }).indexOf(this.selectedEvent);
      }
    }
  }
});
