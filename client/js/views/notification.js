/*global app*/
var log = require('bows')('notifications');
var View = require('ampersand-view');
var async = require('async');
var templates = require('client/js/templates');


module.exports = View.extend({
  template: templates.partials.notifications.view,
  initialize: function (spec) {
    var self = this;
    async.parallel([
      function getMember (cb){
        if(self.model.member){
          app.members.getOrFetch(self.model.member, {all: true}, function (err, model) {
            if (err) {
              log.error('couldnt find a member with id: ' + self.model.member);
              return cb();
            }
            self.model.memberDetails = model;
            log('Got member', model.name);
            cb();
          });
        }
      },
    ], function () {

    });
  },
  bindings: {
    'model.memberDetails.name': '[data-hook~=memberName]',
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
