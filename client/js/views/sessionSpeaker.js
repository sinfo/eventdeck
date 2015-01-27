/*global app*/
var log = require('bows')('session-speaker-view');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var SubCollection = require('ampersand-subcollection');

var SessionView = View.extend({
  template: templates.cards.sessionSpeaker,
  bindings: {
    'model.name': '[data-hook~=name]',
    'model.storedImg': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.background': {
      type: 'attribute',
      hook: 'background',
      name: 'style'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'action-edit',
      name: 'href'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'name',
      name: 'href'
    }
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    this.model.destroy();
    return false;
  }
});

module.exports = View.extend({
  template: templates.cards.sessionSpeakers,
  initialize: function() {
    var self = this; 
    if(!app.speakers.length) {
      return self.filterSpeakers(); 
    }
    
    app.speakers.fetch({ success: function() {
      self.filterSpeakers();
    }});
  },
  filterSpeakers: function() {
    var self = this;
    if(!self.model.speakersDetails.length) {      
      var sessionSpeakerIds = self.model.speakers.serialize()
        .filter(function(s) { return s.id; })
        .map(function(s) { return s.id; });
      
      self.model.speakersDetails = new SubCollection(app.speakers, {
        filter: function (speaker) {
          return sessionSpeakerIds.indexOf(speaker.id) != -1;
        }
      });
    }
    this.render();
  },
  render: function() {
    var self = this;
    this.renderWithTemplate();
    this.renderCollection(self.model.speakersDetails, SessionView, this.queryByHook('session-speaker-view'));
  }
});
