/*global app, alert*/
var log = require('bows')('sessions');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var CommunicationsView = require('client/js/views/communications');
var Communications = require('client/js/models/communications');
var CommentsView = require('client/js/views/comments');
var Comments = require('client/js/models/comments');
var SpeakersView = require('client/js/views/sessionSpeaker');
var CompaniesView = require('client/js/views/sessionCompany');
var Speakers = require('client/js/models/speakers');
var ParticipationsView = require('client/js/views/participations');
var SubscriptionView = require('client/js/views/subscription');
var Users = require('client/js/models/users');
var UsersView = require('client/js/views/users');

module.exports = PageView.extend({
  pageTitle: 'View session',
  template: templates.pages.sessions.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.event': {
      hook: 'event'
    },
    'model.kind': {
      hook: 'kind'
    },
    'model.place': {
      hook: 'place'
    },
    'model.startParsed': {
      hook: 'start'
    },
    'model.endParsed': {
      hook: 'end'
    },
    'model.img': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.descriptionHtml': {
      type: 'innerHTML',
      hook: 'description'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    },
    'model.ticketneeded': {
      hook: 'ticketneeded'
    },
    'model.tickets.start': {
      hook: 'ticketstart'
    },
    'model.tickets.end': {
      hook: 'ticketend'
    },
    'model.tickets.max': {
      hook: 'ticketmax'
    },
    'model.surveyText': {
      hook: 'surveyneeded'
    },
    'model.surveyResults': {
      type: 'attribute',
      hook: 'surveyresults',
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

      model.event = app.events.find(function(s){return s.id == model.event;}).name; 
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
    comments: {
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
    subscription: {
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
    },
    users: {
      container: '[data-hook=users]',
      waitFor: 'model.usersApi',
      prepareView: function (el) {
        var Us = new Users(this.model.usersApi);
        return new UsersView({
          el: el,
          collection: new Us()
        });
      }
    },
    waitingUsers: {
      container: '[data-hook=waiting-users]',
      waitFor: 'model.waitingUsersApi',
      prepareView: function (el) {
        var Us = new Users(this.model.waitingUsersApi);
        return new UsersView({
          el: el,
          collection: new Us()
        });
      }
    },
    confirmedUsers: {
      container: '[data-hook=confirmed-users]',
      waitFor: 'model.confirmedUsersApi',
      prepareView: function (el) {
        var Us = new Users(this.model.confirmedUsersApi);
        return new UsersView({
          el: el,
          collection: new Us()
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
