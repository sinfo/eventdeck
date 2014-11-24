/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberView = require('client/js/views/member');


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
    'model.mails.dropbox': {
      hook: 'mails.dropbox'
    },
    'model.mails.main': {
      hook: 'mails.main'
    },
    'model.mails.google': {
      hook: 'mails.google'
    },
    'model.mails.microsoft': {
      hook: 'mails.microsoft'
    },
    'model.phones': {
      hook: 'phones'
    },
    'model.roleIds': {
      hook: 'roleIds'
    },
    'model.fbURL':{
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

  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('members');
    }});
  }
});
