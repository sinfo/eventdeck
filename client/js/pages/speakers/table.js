/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberSpeakersView = require('client/js/views/memberSpeakers');


module.exports = PageView.extend({
  pageTitle: 'Speakers by Member',
  template: templates.pages.speakers.table,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, MemberSpeakersView, this.queryByHook('members-list'));
    if (!this.collection.length) {
      this.fetchCollection();
      this.collection.comparator = 'name';
      this.collection.sort();
    }
  },
  fetchCollection: function () {
    this.collection.fetch();
    return false;
  },
  initialize: function () {
    app.speakers.fetch();
  }
});
