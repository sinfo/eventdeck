var log = require('bows')('home');
var PageView = require('ampersand-infinite-scroll');
var templates = require('client/js/templates');
var NotificationView = require('client/js/views/notification');

module.exports = PageView.extend({
  pageTitle: 'EventDeck',
  template: templates.pages.home,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, NotificationView, this.queryByHook('notifications-list'));
    if (!this.collection.length) {
      this.fetchCollection({start: true});
    }
  },
  fetchCollection: function () {
    log('Fetching notifications');
    this.collection.fetchPage();

    return false;
  },
});