/*global app*/
var log = require('bows')('user');
var View = require('ampersand-view');
var templates = require('client/js/templates');

module.exports = View.extend({
  template: templates.partials.sessions.user,
  bindings: {
    'model.text': {
      hook: 'text'
    }
  },
  render: function () {
    this.renderWithTemplate();
  }
});
