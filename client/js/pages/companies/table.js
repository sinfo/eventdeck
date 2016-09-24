
var PageView = require('ampersand-infinite-scroll')
var templates = require('../../templates')
var MemberCompaniesView = require('../../views/memberCompanies')
var AmpersandCollection = require('ampersand-collection')
var $ = require('../../helpers/jquery')

module.exports = PageView.extend({
  pageTitle: 'Companies by Member',

  template: templates.pages.companies.table,

  render: function () {
    this.renderWithTemplate()

    this.collection.sortBy('name')
    this.renderWithTemplate()
    this.renderCollection(this.collection, MemberCompaniesView, 'companies-list')

    if (this.collection.length < this.collection.data.limit) {
      this.fetchCollection()
    }
  },

  fetchCollection: function () {
    this.collection.fetchPage({reset: true})
    return false
  },

  resetCollection: function () {
    this.collection.reset()
  },

  renderCards: function (collection) {
    var groups = $(this.queryByHook('members-list')).children('div')

    for (var i = 0; i < groups.length; i++) {
      var columns = $(groups[i]).children('div')

      columns.children('*').remove()

      var collections = []

      for (var j = 0; j < columns.length; j++) {
        var o = new AmpersandCollection()
        for (var key in collection) {
          o[key] = collection[key]
        }
        o.models = []

        collections.push(o)
      }

      for (var k = 0, l = 0; k < collection.models.length; k++, l = (l + 1) % collections.length) {
        collections[l].models.push(collection.models[k])
      }

      for (var m = 0; m < columns.length; m++) {
        this.renderCollection(collections[m], MemberCompaniesView, columns[m])
      }
    }
  }
})
