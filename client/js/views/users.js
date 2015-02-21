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
  session: {
    fetched: 'boolean'
  },
  initialize: function () {
    this.fetched = false;
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, UserView, this.queryByHook('users'));

    if (!this.fetched) {
      this.fetchCollection();
      this.fetched = true;
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
