var AmpModel = require('ampersand-model')

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    kind: ['string'],
    description: ['string'],
    date: ['date'],
    duration: ['date'],
    updated: ['date']
  }
})
