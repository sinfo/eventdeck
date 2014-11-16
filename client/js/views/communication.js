var View = require('ampersand-view');
var templates = require('client/js/templates');


module.exports = View.extend({
  template: templates.cards.communication,
  bindings: {
    'model.kind': '[data-hook~=kind]',
    'model.status': '[data-hook~=status]',
    'model.postedTimeSpan': '[data-hook~=posted]',
    'model.posted': {
      type: 'attribute',
      hook: 'posted',
      name: 'title'
    },
    'model.text': {
      type: 'text',
      hook: 'text'
    },
  },
  events: {
    'click [data-hook~=action-delete]': 'handleRemoveClick'
  },
  handleRemoveClick: function () {
    this.model.destroy();
    return false;
  }
});
