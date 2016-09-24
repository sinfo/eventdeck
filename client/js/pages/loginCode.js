/* global app */
var PageView = require('./base')
var templates = require('../templates')

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.loginCode,

  initialize: function (spec) {
    app.login(spec.id, spec.code)
  }
})
