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
    'model.textHtml': {
      type: 'innerHTML',
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

        var poll = new PollForm({
          el: el,
          model: this.model,
          parent: self,
        });

        poll.on('change:poll', function (data) {
          self.model.poll.options.each(function(o) {
            var optionIndexInPollValue = data.value.indexOf(o.content);
            var memberIndexInVotes = o.votes.indexOf(app.me.id);

            // Nothing changed
            if((optionIndexInPollValue != -1) == (memberIndexInVotes != -1)) {
              return;
            }

            if(optionIndexInPollValue != -1) {
              // Option is selected - Add member to votes
              o.votes.push(app.me.id);
            } else {
              // Option is not selected - Remove member from votes
              o.votes.splice(memberIndexInVotes, 1);
            }
          });

          self.model.save({ poll: self.model.poll.serialize() }, { patch: true });

          log('Vote submitted');
        });

        return poll;
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