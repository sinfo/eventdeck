/*global app*/
var View = require('ampersand-view')
var templates = require('client/js/templates')
var Speaker = require('client/js/models/speaker')
var AmpersandRestCollection = require('ampersand-rest-collection')

module.exports = View.extend({
  template: templates.cards.memberSpeakers,
  bindings: {
    'model.name': '[data-hook~=user-name]',
    'model.img': {
      type: 'attribute',
      hook: 'user-img',
      name: 'src'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'user-url',
      name: 'href'
    }
  },
  initialize: function () {
    var self = this
    self.collection = null

    var SpeakersCollection = AmpersandRestCollection.extend({
      url: '/api/speakers?event=' + app.me.selectedEvent + '&member=' + self.model.id,
      model: Speaker
    })
    var speakers = new SpeakersCollection()

    var options = {
      success: function () {
        self.collection = speakers
        self.render()
      }
    }

    speakers.fetch(options)
  },
  render: function () {
    this.renderWithTemplate()
    this.renderCollection(this.collection, MemberCompaniesRow, this.queryByHook('speakersContainer'))
  }
})

var MemberCompaniesRow = View.extend({
  template: templates.cards.memberSpeakersRow,
  bindings: {
    'model.name': '[data-hook~=speaker-name]',
    'model.img': {
      type: 'attribute',
      hook: 'speaker-img',
      name: 'src'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'speaker-url',
      name: 'href'
    },
    'model.statusDetails.style': {
      type: 'attribute',
      hook: 'status',
      name: 'style'
    }
  }
})
