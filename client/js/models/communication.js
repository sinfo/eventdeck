// communication Model - communication.js
var AmpModel = require('ampersand-model');


module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    thread: ['string'],
    event: ['string'],
    kind: ['string'],
    member:['string'],
    text:['string'],
    status:['string'],
    posted:['string'],
    updated:['string'],
  },
});