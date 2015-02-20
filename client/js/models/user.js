/*global app*/
var AmpModel = require('ampersand-model');

module.exports = AmpModel.extend({
  props: {
    id: 'string',
    name: 'string'
  },
  derived: {
    text: {
      deps: ['name', 'id'],
      fn: function () {
        return this.name + ' [' + this.id + ']';
      }
    }
  }
});
