var PageView = require('../views/notifications')
var templates = require('../templates')

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.home
})
