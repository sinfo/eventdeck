/*global app*/
var log = require('bows')('member-badge');
var View = require('ampersand-view');
var templates = require('client/js/templates');


module.exports = View.extend({
  template: templates.partials.members.badge,
  bindings: {
    'model.memberDetails.name': '[data-hook~=member-name]',
    'model.memberDetails.img': {
      type: 'attribute',
      hook: 'member-img',
      name: 'src'
    },
    'model.memberDetails.viewUrl': {
      type: 'attribute',
      hook: 'action-view',
      name: 'href'
    },
  },
  initialize: function (spec) {
    var self = this;
    if(self.model.member && !self.model.memberDetails){
      app.members.getOrFetch(self.model.member, {all: true}, function (err, model) {
        if (err) {
          log.error('couldnt find a member with id: ' + self.model.member);
          return;
        }
        self.model.memberDetails = model;
        log('Got member', model.name);
      });
    }
  },
});
