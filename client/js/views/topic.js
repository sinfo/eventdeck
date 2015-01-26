/*global app*/
var View = require('ampersand-view');
var templates = require('client/js/templates');
var TagsView = require('client/js/views/topicTags');

module.exports = View.extend({
  template: templates.cards.topic,
  bindings: {
    'model.name': '[data-hook~=name]',
    'model.unread': {
      hook: 'unread',
      type: 'toggle'
    },
    'model.kindDetails.name': '[data-hook~=kind]',
    'model.kindDetails.style': {
      type: 'attribute',
      hook: 'kind',
      name: 'style'
    },
    'model.viewUrl': {
      type: 'attribute',
      hook: 'name',
      name: 'href'
    },
    'model.thread': {
      type: 'attribute',
      hook: 'topic-card',
      name: 'id'
    }
  },
  subviews: {
    tags: {
      container: '[data-hook=tags-container]',
      waitFor: 'model.tags',
      prepareView: function (el) {
        var self = this;
        return new TagsView({
          el: el,
          model: self.model
        });
      }
    },
  }
});
