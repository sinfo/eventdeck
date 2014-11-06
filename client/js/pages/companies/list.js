var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberView = require('client/js/views/company');


module.exports = PageView.extend({
  pageTitle: 'Companies',
  template: templates.pages.members.list,
  events: {
    'click [data-hook~=shuffle]': 'shuffle',
    'click [data-hook~=fetch]': 'fetchCollection',
    'click [data-hook~=reset]': 'resetCollection',
  },
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, MemberView, this.queryByHook('companies-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    this.collection.fetch();
    return false;
  },
  resetCollection: function () {
    this.collection.reset();
  },
  shuffle: function () {
    this.collection.comparator = function () {
        return !Math.round(Math.random());
    };
    this.collection.sort();
    delete this.collection.comparator;
    return false;
  },
});
