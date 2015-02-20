/*global app, alert*/
var $ = require('jquery');
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

      // temporary piece of code below
      $.ajax({
        url: 'https://cannon.sinfo.org/tickets/' + self.model.id,
        success: function (ids) {
          $.ajax({
            url: 'https://cannon.sinfo.org/tickets/' + self.model.id + '/users',
            success: function (users) {
              var usersDiv = $(self.queryByHook('users'));

              if (!users || users.length < 1) {
                usersDiv.append($('<p>There are no users.</p>'));
              }
              else {
                users.forEach(function (user) {
                  usersDiv.append($('<p>' + user.name + '</p>'));
                });

                $('#users').text($('#users').text() + ' (' + users.length + ')');
              }

              var waitingDiv = $(self.queryByHook('waiting-list'));

              if (!ids.waiting || ids.waiting.length < 1) {
                waitingDiv.append($('<p>There are no users in the waiting list.</p>'));
              }
              else {
                ids.waiting.forEach(function (id) {
                  waitingDiv.append($('<p>' + id + '</p>'));
                });

                $('#waiting-list').text($('#waiting-list').text() + ' (' + ids.waiting.length + ')');
              }

              var confirmedDiv = $(self.queryByHook('confirmed-users'));

              if (!ids.confirmed || ids.confirmed.length < 1) {
                confirmedDiv.append($('<p>There are no confirmed users.</p>'));
              }
              else {
                var found = false;

                ids.confirmed.forEach(function (id) {
                  var user = findUserById(id);

                  if (user) {
                    found = true;
                    confirmedDiv.append($('<p>' + user.name + '</p>'));
                  }
                });

                if (!found) {
                  confirmedDiv.append($('<p>There are no confirmed users.</p>'));
                }
                else {
                  $('#confirmed-users').text($('#confirmed-users').text() + ' (' + ids.confirmed.length + ')');
                }
              }

              function findUserById(id) {
                return users.filter(function (user) {
                  return user.id === id;
                })[0];
              }
            }
          });
        },
        error: function () {
          $(self.queryByHook('users')).append($('<p>There are no users.</p>'));
          $(self.queryByHook('confirmed-users')).append($('<p>There are no confirmed users.</p>'));
          $(self.queryByHook('waiting-list')).append($('<p>There are no users in the waiting list.</p>'));
        }
      });
      // temporary piece of code above
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
