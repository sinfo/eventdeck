var AmpModel = require('ampersand-model');


module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    color: ['string'],
  },
});