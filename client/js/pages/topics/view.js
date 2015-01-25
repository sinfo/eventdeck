/*global app, alert*/
var log = require('bows')('topics');
var PageView = require('client/js/pages/base');
var templates = require('client/js/templates');
var TopicView = require('client/js/views/topic');
var CommentsView = require('client/js/views/comments');
var SubscriptionView = require('client/js/views/subscription');
var Comments = require('client/js/models/comments');
var PollForm = require('client/js/forms/poll');
var MemberBadge = require('client/js/views/memberBadge');

var $ = require('client/js/helpers/jquery');
var _ = require('client/js/helpers/underscore');

module.exports = PageView.extend({
  pageTitle: 'View topic',
  template: templates.pages.topics.view,
  bindings: {
    'model.name': {
      hook: 'name'
    },
    'model.targets': {
      hook: 'targets'
    },
    'model.kindDetails.name': {
      hook: 'kind'
    },
    'model.kindDetails.style': {
      type: 'attribute',
      hook: 'kind',
      name: 'style'
    },
    'model.duedate': {
      hook: 'duedate'
    },
    'model.closed': {
      hook: 'closed'
    },
    'model.postedTimeSpan': '[data-hook~=posted]',
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
      log('Got topic', model.name);

      self.model = model;
      app.access(model);
      // self.render();
      if(app.tags.length) {
        self.renderTagFilters();
      } else {
        app.tags.fetch();
      }
    });
  },
  render: function () {
    log('RENDEEEER');

    var self = this;
    PageView.prototype.render.apply(self);

    if(!self.model) {
      return;
    }

    if(app.tags.length) {
      return self.renderTagFilters();
    }

    app.tags.on('sync', function () {
      log('got tags', app.tags.serialize());
      self.renderTagFilters();
    });
  },
  renderTagFilters: function () {
    var self = this;
    var details = app.tags.serialize().filter(function (tag) {
      return self.model.tags.indexOf(tag.id) != -1;
    });

    log('Rendering tags!!!', details);

    // var tagsContainer = $(self.queryByHook('topic-tags'));
    var tagsContainer = $('[data-hook=topic-tags]');
    _.each(details, function (tag) {
      tagsContainer.append('<span class=\'tag\' data-hook=\''+tag.id+'\' style = \"color:#F0F8FF; background:'+tag.color+'">'+tag.name+'</span>');
    });
  },
  subviews: {
    subscription:{
      container: '[data-hook=topic-subscription]',
      parent: this,
      waitFor: 'model.thread',
      prepareView: function (el) {
        var self = this;
        return new SubscriptionView({
          el: el,
          model: self.model,
          parent: self,
        });
      }
    },
    member: {
      container: '[data-hook=member-container]',
      waitFor: 'model.member',
      prepareView: function (el) {
        var self = this;
        return new MemberBadge({
          el: el,
          model: self.model
        });
      }
    },
    poll: {
      container: '[data-hook=topic-poll]',
      waitFor: 'model.poll.options',
      parent: this,
      prepareView: function (el) {
        var self = this;
        var model = this.model;

        self.queryByHook('topic-poll').innerHTML = '';

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
        log('Preparing topics!');
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