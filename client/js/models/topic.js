var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');
var log = require('bows')('topics');

var PollOption = AmpState.extend({
  props: {
    content: 'string',
    votes: 'array',
  }
});

var PollOptions = AmpCollection.extend({
    model: PollOption
});

var Poll = AmpState.extend({
  props: {
    kind: 'string',
  },
  collections: {
    options: PollOptions
  }
});


module.exports = AmpModel.extend({
  props: {
    id: 'string',
    kind: 'string',
    name: 'string',
    text: 'string',
    author: 'string',
    targets: 'array',
    closed: 'boolean',
    duedate: 'string',
    tags: 'array',
    posted: 'string',
    updated: 'string',
  },

  children: {
    poll: Poll
  },

  derived: {
    thread: {
      deps: ['id'],
      fn: function () {
        return 'topic-' + this.id;
      }
    },
    editUrl: {
      deps: ['id'],
      fn: function () {
        return '/topics/' + this.id + '/edit';
      }
    },
    viewUrl: {
      deps: ['id'],
      fn: function () {
        return '/topics/' + this.id;
      }
    },
    commentsApi: {
      deps: ['id'],
      fn: function () {
        return '/api/topics/' + this.id + '/comments';
      }
    },
    kindDetails: {
      deps: ['kind'],
      fn: function() {
        var self = this;
        var details = options.kinds.topics.filter(function (kind) {
          return kind.id == self.kind;
        })[0];

        if(!details) {
          return;
        }

        details.style = details.color && 'color:' +details.color;
        return details;
      }
    },
    hasPoll: {
      deps: ['kind', 'poll'],
      fn: function () {
        return this.kind == 'decision' && this.poll;
      }
    },
    textHtml: {
      deps: ['text'],
      fn: function () {
        return this.text && marked(this.text) || '';
      },
    }
  }

});
