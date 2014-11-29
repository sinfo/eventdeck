/*global app*/
var View = require('ampersand-view');
var templates = require('client/js/templates');
var Company = require('client/js/models/speaker');
var AmpersandCollection = require('ampersand-collection');

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
  initialize: function() {
    var self = this;
    this.collection = null;
    app.speakers.on('sync', function() {
      var speakers = app.speakers.filter(function(speaker){
        return speaker.participation && speaker.participation.member == self.model.id;
      });
      self.collection = new AmpersandCollection(speakers, {model: Company});
      self.render();
    });

  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, MemberCompaniesRow, this.queryByHook('speakersContainer'));
  },
});

var MemberCompaniesRow = View.extend({
  template: templates.cards.memberCompaniesRow,
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
  },
});

