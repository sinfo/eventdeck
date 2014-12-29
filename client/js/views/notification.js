var View = require('ampersand-view');

var templates = require('client/js/templates');



module.exports = View.extend({
  template: templates.partials.notifications.view,
  bindings: {
    'model.memberName': {
      hook: 'member',
      type: 'toggle'
    },
    'model.description': {
      hook: 'description'
    },
    'model.postedTimeSpan': {
      hook: 'posted',
    },
    'model.threadUrl': {
      hook: 'threadUrl',
      type: 'attribute',
      name: 'href'
    }
  }
});
