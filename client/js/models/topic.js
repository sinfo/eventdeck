var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');

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
    upstringd: 'string',
  },
  // children: {
  //   poll: Poll
  // }

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
  }

});

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

