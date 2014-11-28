var View = require('ampersand-view');
var templates = require('client/js/templates');


module.exports = View.extend({
  template: templates.cards.topic,
  bindings: {
    'model.text': '[data-hook~=name]',
    'model.kind': '[data-hook~=kind]',
    'model.viewUrl': {
      type: 'attribute',
      hook: 'name',
      name: 'href'
    }
  },
});
