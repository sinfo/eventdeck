/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberParticipationsView = require('client/js/views/memberParticipations');

module.exports = PageView.extend({
  pageTitle: 'View member',
  template: templates.pages.members.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.img': {
      type: 'attribute',
      hook: 'img',
      name: 'src'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    },
    'model.mails.main': [
      { type: 'toggle', hook: 'mails-main' },
      { selector: '[data-hook~=mails-main] span' }
    ],
    'model.mails.institutional': [
      { type: 'toggle', hook: 'mails-institutional' },
      { selector: '[data-hook~=mails-institutional] span' }
    ],
    'model.mails.google': [
      { type: 'toggle', hook: 'mails-google' },
      { selector: '[data-hook~=mails-google] span' }
    ],
    'model.mails.microsoft': [
      { type: 'toggle', hook: 'mails-microsoft' },
      { selector: '[data-hook~=mails-microsoft] span' }
    ],
    'model.mails.dropbox': [
      { type: 'toggle', hook: 'mails-dropbox' },
      { selector: '[data-hook~=mails-dropbox] span' }
    ],
    'model.phones': {
      hook: 'phones'
    },
    'model.roleIds': {
      hook: 'roleIds'
    },
    'model.fbURL': {
      type: 'attribute',
      hook: 'fbURL',
      name: 'href'
    }
  },
  events: {
    'click [data-hook~=delete]': 'handleDeleteClick'
  },
  initialize: function (spec) {
    var self = this;
    app.members.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        return alert('couldnt find a model with id: ' + spec.id);
      }
      self.model = model;
    });
  },
  subviews: {
    participations: {
      container: '[data-hook=member-participations]',
      waitFor: 'model.participations',
      prepareView: function (el) {
        return new MemberParticipationsView({
          el: el,
          collection: this.model.participations
        });
      }
    }
  },

  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('members');
    }});
  }
});
