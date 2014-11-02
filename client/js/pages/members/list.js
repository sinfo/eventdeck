var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberView = require('client/js/views/member');


module.exports = PageView.extend({
  pageTitle: 'Members',
  template: templates.pages.members.list,
  events: {
    'click [data-hook~=fetch]': 'fetchCollection',
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, MemberView, this.queryByHook('members-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    this.collection.fetch();
    return false;
  },
});
