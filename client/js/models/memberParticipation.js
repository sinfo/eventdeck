var AmpState = require('ampersand-state')
var EventModel = require('./event')
var options = require('../../../options')

module.exports = AmpState.extend({
  props: {
    event: ['string'],
    role: ['string']
  },
  session: {
    eventDetails: EventModel,
    editing: ['boolean']
  },
  derived: {
    roleName: {
      deps: ['role'],
      fn: function () {
        for (var i = 0; i < options.roles.length; i++) {
          if (options.roles[i].id === this.role) {
            return options.roles[i].name
          }
        }
      }
    }
  }
})
