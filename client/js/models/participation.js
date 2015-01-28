var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var Member = require('./member');
var options = require('options');

var Payment = AmpState.extend({
  props: {
    price: ['any'],
    date: ['any'],
    invoice: ['string'],
    status: ['string'],
    via: ['string']
  }
});

var Item = AmpState.extend({
  props: {
    id: ['string'],
    amount: ['number'],
    kind: ['string']
  }
});

var ItemCollection = AmpCollection.extend({
  model: Item
});

module.exports = AmpState.extend({
  props: {
    event: ['string'],
    member: ['string'],
    status: ['string'],
    kind: ['string']
  },
  children: {
    payment: Payment
  },
  session: {
    threadKind: ['string'],
    memberDetails: Member,
    eventDetails: Event,
    editing: ['boolean']
  },
  collections: {
    items: ItemCollection
  },
  derived: {
    statusDetails: {
      deps: ['status', 'threadKind'],
      fn: function () {
        var self = this;

        var details = options.statuses[this.threadKind || 'company'].filter(function (status) {
          return self.status == status.id;
        })[0] || {};

        details.style = details && details.color && 'background-color:' + details.color;
        return details;
      }
    },
  }
});
