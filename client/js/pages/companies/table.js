/*global app, alert*/
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var MemberCompaniesView = require('client/js/views/memberCompanies');
var AmpersandCollection = require('ampersand-collection');
var $ = require('client/js/helpers/jquery');


module.exports = PageView.extend({
  pageTitle: 'Companies by Member',

  template: templates.pages.companies.table,

  render: function () {
    this.renderWithTemplate();

    if (!this.collection.length) {
      this.fetchCollection();
    }
    else {
      this.renderCards(this.collection);
    }
  },

  fetchCollection: function () {
    var that = this;
    this.collection.fetch({
      success: function () {
        that.collection.comparator = 'name';
        that.collection.sort();
        that.renderCards(that.collection);
      }
    });

    return false;
  },

  renderCards: function (collection) {
    var groups = $(this.queryByHook('members-list')).children('div');

    for (var i = 0; i < groups.length; i++) {
      var columns = $(groups[i]).children('div');

      columns.children('*').remove();

      var collections = [];

      for (var j = 0; j < columns.length; j++) {
        var o = new AmpersandCollection();
        for (var key in collection) {
          o[key] = collection[key];
        }
        o.models = [];

        collections.push(o);
      }

      for (var k = 0, l = 0; k < collection.models.length; k++, l = (l+1) % collections.length) {
        collections[l].models.push(collection.models[k]);
      }

      for (var m = 0; m < columns.length; m++) {
        this.renderCollection(collections[m], MemberCompaniesView, columns[m]);
      }
    }
  },

  initialize: function () {
    app.companies.fetch();
  }
});
