var log = require('bows')('home');
var async = require('async');
var PageView = require('ampersand-infinite-scroll');
var templates = require('client/js/templates');
var NotificationView = require('client/js/views/notification');

module.exports = PageView.extend({
  template: templates.partials.notifications.list,
  initialize: function (spec) {
    var self = this;
    async.parallel([
      function getMembers (cb){
        app.members.fetch({
          success: function (collection, response, options) {
            log('Got members');
            cb();
          },
          error: function (collection, response, options) {
            log('Error getting members', response);
            cb();
          }
        });
      },
      function getCompanies (cb){
        app.companies.fetch({
          success: function (collection, response, options) {
            log('Got companies');
            cb();
          },
          error: function (collection, response, options) {
            log('Error getting companies', response);
            cb();
          }
        });
      },
      function getSpeakers (cb){
        app.speakers.fetch({
          success: function (collection, response, options) {
            log('Got speakers');
            cb();
          },
          error: function (collection, response, options) {
            log('Error getting speakers', response);
            cb();
          }
        });
      },
      function getTopics (cb){
        app.topics.fetch({
          success: function (collection, response, options) {
            log('Got topics');
            cb();
          },
          error: function (collection, response, options) {
            log('Error getting topics', response);
            cb();
          }
        });
      },
    ], function () {
      self.render();
    });
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, NotificationView, this.queryByHook('notifications-list'));
    if (!this.collection.length) {
      this.fetchCollection({reset: true});
    }
  },
  fetchCollection: function () {
    log('Fetching notifications');
    this.collection.fetchPage({reset: true});

    return false;
  },
});