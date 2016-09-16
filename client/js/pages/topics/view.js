/* global app */
var log = require('bows')('topics')
var PageView = require('client/js/pages/base')
var templates = require('client/js/templates')
var TagsView = require('client/js/views/topicTags')
var CommentsView = require('client/js/views/comments')
var SubscriptionView = require('client/js/views/subscription')
var Comments = require('client/js/models/comments')
var PollForm = require('client/js/forms/poll')
var MemberBadge = require('client/js/views/memberBadge')

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
    'model.textHtml': {
      type: 'innerHTML',
      hook: 'text'
    },
    'model.editUrl': {
      type: 'attribute',
      hook: 'edit',
      name: 'href'
    }
  },
  events: {
    'click [data-hook~=delete]': 'handleDeleteClick'
  },
  initialize: function (spec) {
    var self = this
    app.topics.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) {
        log.error('couldnt find a topic with id: ' + spec.id)
      }
      log('Got topic', model.name)

      self.model = model
      app.access(model)
    })
  },
  render: function () {
    var self = this
    PageView.prototype.render.apply(self)
  },
  subviews: {
    subscription: {
      container: '[data-hook=topic-subscription]',
      parent: this,
      waitFor: 'model.thread',
      prepareView: function (el) {
        var self = this
        return new SubscriptionView({
          el: el,
          model: self.model,
          parent: self
        })
      }
    },
    member: {
      container: '[data-hook=member-container]',
      waitFor: 'model.member',
      prepareView: function (el) {
        var self = this
        return new MemberBadge({
          el: el,
          model: self.model
        })
      }
    },
    tags: {
      container: '[data-hook=tags-container]',
      waitFor: 'model.tags',
      prepareView: function (el) {
        var self = this
        return new TagsView({
          el: el,
          model: self.model
        })
      }
    },
    poll: {
      container: '[data-hook=topic-poll]',
      waitFor: 'model.poll.options',
      parent: this,
      prepareView: function (el) {
        var self = this

        self.queryByHook('topic-poll').innerHTML = ''

        var poll = new PollForm({
          el: el,
          model: this.model,
          parent: self
        })

        poll.on('change:poll', function (data) {
          self.model.poll.options.each(function (o) {
            var optionIndexInPollValue = data.value.indexOf(o.content)
            var memberIndexInVotes = o.votes.indexOf(app.me.id)

            // Nothing changed
            if ((optionIndexInPollValue !== -1) === (memberIndexInVotes !== -1)) {
              return
            }

            if (optionIndexInPollValue !== -1) {
              // Option is selected - Add member to votes
              o.votes.push(app.me.id)
            } else {
              // Option is not selected - Remove member from votes
              o.votes.splice(memberIndexInVotes, 1)
            }
          })

          self.model.save({ poll: self.model.poll.serialize() }, { patch: true })

          log('Vote submitted')
        })

        return poll
      }
    },
    comments: {
      container: '[data-hook=topic-comments]',
      waitFor: 'model.commentsApi',
      prepareView: function (el) {
        log('Preparing topics!')
        var Comms = new Comments(this.model.commentsApi)
        return new CommentsView({
          el: el,
          collection: new Comms()
        })
      }
    }
  },
  handleDeleteClick: function () {
    this.model.destroy({success: function () {
      app.navigate('topics')
    }})
  }
})
