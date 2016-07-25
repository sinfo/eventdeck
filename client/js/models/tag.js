var AmpModel = require('ampersand-model')

module.exports = AmpModel.extend({
  props: {
    id: ['string'],
    name: ['string'],
    color: ['string']
  },
  derived: {
    style: {
      deps: ['color'],
      fn: function () {
        return 'background-color:' + this.color
      }
    }
  }
})
