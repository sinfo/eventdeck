/*global app, alert*/
var log = require('bows')('sessions');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var SessionView = require('client/js/views/session');
var CommunicationsView = require('client/js/views/communications');
var Communications = require('client/js/models/communications');
var CommentsView = require('client/js/views/comments');
var Comments = require('client/js/models/comments');
var SpeakersView = require('client/js/views/sessionSpeaker');
var CompaniesView = require('client/js/views/sessionCompany');
var Speakers = require('client/js/models/speakers');
var ParticipationsView = require('client/js/views/participations');
var SubscriptionView = require('client/js/views/subscription');


module.exports = PageView.extend({
  pageTitle: 'View session',
  template: templates.pages.sessions.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.kind': {
      hook: 'kind'
    },
    'model.place': {
      hook: 'place'
    },
    'model.description': {
      hook: 'description'
    },
    'model.date': {
      hook: 'date'
    },
    'model.end': {
      hook: 'duration'
    },
    'model.img': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.descriptionHtml': {
      type: 'innerHTML',
      hook: 'descriptionHtml'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    },
  },
  events: {
    'click [data-hook~=delete]': 'handleDeleteClick',
  },
  initialize: function (spec) {
    var self = this;
    app.sessions.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        log.error('couldnt find a session with id: ' + spec.id);
      }
      self.model = model;
      log('Got session', model.name);
    });
  },
  subviews: {
    speakers: {
      container: '[data-hook=session-speakers]',
      parent: this,
      waitFor: 'model.speakers',
      prepareView: function (el) {
        var self = this;
        return new SpeakersView({
          el: el,
          model: self.model
        });
      }
    },
    companies: {
      container: '[data-hook=session-companies]',
      parent: this,
      waitFor: 'model.companies',
      prepareView: function (el) {
        var self = this;
        return new CompaniesView({
          el: el,
          model: self.model
        });
      }
    },
    comments:{
      container: '[data-hook=session-comments]',
      waitFor: 'model.commentsApi',
      prepareView: function (el) {
        var Comms = new Comments(this.model.commentsApi);
        return new CommentsView({
          el: el,
          collection: new Comms()
        });
      }
    },
    subscription:{
      container: '[data-hook=session-subscription]',
      parent: this,
      waitFor: 'model.thread',
      prepareView: function (el) {
        var self = this;
        return new SubscriptionView({
          el: el,
          model: self.model,
          parent: self,
        });
      }
    }
  },
  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('sessions');
    }});
  }
});