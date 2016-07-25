var log = require('bows')('home')
var PageView = require('client/js/views/notifications')
var templates = require('client/js/templates')
var NotificationView = require('client/js/views/notification')

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.home
})
