/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var AmpersandModel = require('ampersand-model');

var LoginModel = AmpersandModel.extend({
  props: {
		id: 'string'
	}
});

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.login,

  bindings: {
    'model.id': '[data-hook=id]'
  },

  events: {
  	'click #login': 'login'
  },

  initialize: function () {
  	this.model = new LoginModel({
  		id: ''
  	});
  },

  login: function () {
  	console.log(this.model.id);
  }
});
