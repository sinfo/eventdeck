// Me Model - me.js
var Member = require('./member');

module.exports = Member.extend({
  url: '/api/members/me',

  session: {
    signedIn: ['boolean', true, false],
    selectedEvent: ['string'],
    selectedEventIndex: ['number'],
  }
});