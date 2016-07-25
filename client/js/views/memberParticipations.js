var log = require('bows')('participations')
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var ParticipationView = require('client/js/views/memberParticipation')

module.exports = PageView.extend({
  template: templates.partials.participations.area,
  render: function () {
    this.renderWithTemplate()
    this.renderCollection(this.collection, ParticipationView, this.queryByHook('participations-list'))
    log('Rendering', this.collection.length, 'participation(s)')
  },
  events: {
    'click [data-hook~=add]': 'addNew'
  },
  addNew: function () {
    this.collection.add({editing: true})
  }
})
