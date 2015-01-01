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
      function getThing (cb){
        switch (self.model.threadKind) {
          case 'company':
            app.companies.getOrFetch(self.model.threadId, {all: true}, function (err, model) {
              if (err) {
                log.error('couldnt find a company with id: ' + self.model.threadId);
                return cb();
              }
              self.model.threadDetails = { name: model.name, img: model.img };
              cb();
            });
          break;
          case 'speaker':
            app.speakers.getOrFetch(self.model.threadId, {all: true}, function (err, model) {
              if (err) {
                log.error('couldnt find a speaker with id: ' + self.model.threadId);
                return cb();
              }
              self.model.threadDetails = { name: model.name, img: model.img };
              cb();
            });
          break;
          case 'topic':
            app.topics.getOrFetch(self.model.threadId, {all: true}, function (err, model) {
              if (err) {
                log.error('couldnt find a topic with id: ' + self.model.threadId);
                return cb();
              }
              self.model.threadDetails = { name: model.name, img: model.img };
              cb();
            });
          break;
        }
      }
    ], function () {
      self.render();
    });
  },
  render: function () {
    if(this.renderWithTemplate) {
      this.renderWithTemplate();
    }
  },
  bindings: {
    'model.memberDetails.name': '[data-hook~=memberName]',
    'model.threadDetails.name': '[data-hook~=threadName]',
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
