var View = require('ampersand-view');
var templates = require('client/js/templates');

module.exports =  View.extend({
  template: templates.cards.participation,
  bindings: {
    'model.event': '[data-hook~=event]',
    'model.member': '[data-hook~=member]',
    'model.status': '[data-hook~=status]',
    'model.kind': '[data-hook~=kind]'
  }
});