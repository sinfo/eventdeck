/* global app */
var View = require('ampersand-view')
var templates = require('client/js/templates')
var SubCollection = require('ampersand-subcollection')

var TagView = View.extend({
  template: templates.partials.topics.tag,
  bindings: {
    'model.name': '[data-hook~=tag]',
    'model.style': {
      type: 'attribute',
      hook: 'tag',
      name: 'style'
    }
  }
})

module.exports = View.extend({
  template: templates.partials.topics.tags,
  initialize: function () {
    var self = this
    if (!app.tags.length) {
      return self.filterTags()
    }

    app.tags.fetch({success: function () {
      self.filterTags()
    }})
  },
  filterTags: function () {
    var self = this
    if (!this.model.tagsDetails.length) {
      this.model.tagsDetails = new SubCollection(app.tags, {
        filter: function (tag) {
          return self.model.tags.indexOf(tag.id) !== -1
        }
      })
    }
    this.render()
  },
  render: function () {
    var self = this
    this.renderWithTemplate()
    this.renderCollection(self.model.tagsDetails, TagView, this.queryByHook('topic-tags'))
  // log('Rendering', self.model.tagsDetails.length, 'tag(s)')
  }
})
