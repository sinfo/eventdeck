//Participation Model - participation.js
var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');

var Payment = AmpState.extend({
  props: {
    price: ['number'],
    date: ['string'],
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
  collections: {
    items: ItemCollection
  }
});
