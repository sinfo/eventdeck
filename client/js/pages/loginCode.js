/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.loginCode,

  initialize: function (spec) {
  	app.login(spec.id, spec.code);
  }
});
