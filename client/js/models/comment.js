// communication Model - communication.js
var AmpModel = require('ampersand-model');
var timeSince = require('client/js/helpers/timeSince');
var options = require('options');

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    thread: ['string'],
    subthread: ['string'],
    member: ['string'],
    text: ['string'],
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
    },
    memberName: {
      deps: ['member'],
      fn: function () {
        app.members.getOrFetch(this.member, {all: true}, function (err, model) {
          return model.name;
        });
      }
    }
  }
});
