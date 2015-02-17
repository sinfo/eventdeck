/*global app*/
var log = require('bows')('comments');
var View = require('ampersand-view');
var templates = require('client/js/templates');
var _ = require('client/js/helpers/underscore');

module.exports = View.extend({
  template: templates.partials.sessions.user,
  render: function () {
    this.renderWithTemplate();
  }
});
