var PageView = require('./base');
var templates = require('client/js/templates');


module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.home
});
