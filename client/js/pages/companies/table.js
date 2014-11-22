var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberCompaniesView = require('client/js/views/memberCompanies');


module.exports = PageView.extend({
  pageTitle: 'Companies by Member',
  template: templates.pages.companies.table,
  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, MemberCompaniesView, this.queryByHook('members-list'));
    if (!this.collection.length) {
      this.fetchCollection();
    }
  },
  fetchCollection: function () {
    this.collection.fetch();
    return false;
  },
  initialize: function () {
    app.companies.fetch();
  }
});
