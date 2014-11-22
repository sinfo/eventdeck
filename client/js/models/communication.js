// communication Model - communication.js
var AmpModel = require('ampersand-model');
var timeSince = require('client/js/helpers/timeSince');
var options = require('options');

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
    },
    memberName: {
      deps: ['member'],
      fn: function () {
        app.members.getOrFetch(this.member, {all: true}, function (err, model) {
          return model.name;
        });
      }
    },
    statusDetails: {
      deps: ['status'],
      fn: function () {
        var self = this;
        var details = options.statuses.communication.filter(function (status) {
          return status.id == self.status;
        })[0];

        if(!details) {
          return;
        }

        details.style = details.color && 'background-color:' +details.color;

        return details;
      }
    }
  }
});
