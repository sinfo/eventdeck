/*global app*/
var View = require('ampersand-view');
var templates = require('client/js/templates');
var _ = require('client/js/helpers/underscore');
var $ = require('client/js/helpers/jquery');

module.exports = View.extend({
  template: templates.cards.topic,
  bindings: {
    'model.name': '[data-hook~=name]',
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
  render: function () {
    var self = this;

    self.renderWithTemplate();

    var topicTags = app.tags.serialize().filter(function (tag) {
      return self.model.tags.indexOf(tag.id) != -1;
    });

    var tagsContainer = $('#'+this.model.thread+' [data-hook=tags]');
    _.each(topicTags, function (tag) {
      tagsContainer.append('<div style=\'color:'+tag.color+'\'>'+tag.name+'</div>');
    });

  }
});
