/*global app, alert*/
var log = require('bows')('topics');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicView = require('client/js/views/topic');
var CommentsView = require('client/js/views/comments');
var Comments = require('client/js/models/comments');
var PollForm = require('client/js/forms/poll');


module.exports = PageView.extend({
  pageTitle: 'View topic',
  template: templates.pages.topics.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.kind': {
      hook: 'kind'
    },
    'model.text': {
      hook: 'text'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    },
  },
  events: {
    'click [data-hook~=delete]': 'handleDeleteClick'
  },
  initialize: function (spec) {
    var self = this;
    app.topics.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        log.error('couldnt find a topic with id: ' + spec.id);
      }
      self.model = model;
      log('Got topic', model.name);
    });
  },
  subviews: {
    form: {
      container: '[data-hook=topic-poll]',
      waitFor: 'model.hasPoll',
      parent: this,
      prepareView: function (el) {
        var self = this;
        var model = this.model;

        return new PollForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            log('POLL', data);
          }
        });
      }
    },

    comments:{
      container: '[data-hook=topic-comments]',
      waitFor: 'model.commentsApi',
      prepareView: function (el) {
        var Comms = new Comments(this.model.commentsApi);
        return new CommentsView({
          el: el,
          collection: new Comms()
        });
      }
    },
  },
  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('topics');
    }});
  }
});