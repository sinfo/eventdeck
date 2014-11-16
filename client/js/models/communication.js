// communication Model - communication.js
var AmpModel = require('ampersand-model');
var timeSince = require('client/js/helpers/timeSince');

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    thread: ['string'],
    event: ['string'],
    kind: ['string'],
    member: ['string'],
    text: ['string'],
    status: ['string'],
    posted: ['string'],
    updated: ['string']
  },
  derived: {
    postedTimeSpan: {
      deps: ['posted'],
      fn: function () {
        return timeSince(this.posted);
      },
      cache: false
    }
  }
});
