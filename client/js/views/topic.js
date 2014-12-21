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
    }
  },
  initialize: function (spec) {
    var self = this;

    var details = app.tags.serialize().filter(function (tag) {
      return self.model.tags.indexOf(tag.id) != -1;
    });

    var filterContainer = $(self.query('[data-hook~=tags]'));
    _.each(details, function (tag) {
      filterContainer.append('<div class=\'ink-button\' data-hook=\''+tag.id+'\' style = \"color:#F0F8FF; background:'+tag.color+'">'+tag.name+'</div>');
    });
  },

});
