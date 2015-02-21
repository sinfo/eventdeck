var log = require('bows')('users');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var UserView = require('client/js/views/user');

module.exports = PageView.extend({
  template: templates.partials.sessions.users,
  bindings: {
    'title': {
      hook: 'title'
    }
  },
  derived: {
    title: {
      deps: ['collection'],
      fn: function () {
        return this.el.parentElement.getAttribute('data-title') + ' (' + this.collection.length + ')';
      },
      cache: false
    }
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, UserView, this.queryByHook('users'));

    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    log('Fetching users');
    var self = this;
    self.collection.fetch({
      success: function () {
        self.render();
      }
    });
    return false;
  }
});
