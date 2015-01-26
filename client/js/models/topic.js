var AmpState = require('ampersand-state');
var AmpModel = require('ampersand-model');
var AmpCollection = require('ampersand-collection');
var options = require('options');
var marked = require('client/js/helpers/marked');
var log = require('bows')('topics');
var timeSince = require('client/js/helpers/timeSince');
var _ = require('client/js/helpers/underscore');
var Member = require('./member');
var Tag = require('./tag');

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

var Tags = AmpCollection.extend({
    model: Tag
});


module.exports = AmpModel.extend({
  props: {
    id: 'string',
    unread: 'boolean',
    kind: 'string',
    name: 'string',
    text: 'string',
    author: 'string',
    targets: 'array',
    closed: 'boolean',
    duedate: 'date',
    tags: 'array',
    posted: 'string',
    updated: 'string',
  },

  parse: function (attrs) {
    if(attrs.duedate) {
      attrs.duedate = new Date(attrs.duedate);
    }
    return attrs;
  },

  children: {
    poll: Poll
  },

  session: {
    memberDetails: Member,
  },

  collections: {
    tagsDetails: Tags
  },

  derived: {
    thread: {
      deps: ['id'],
      fn: function () {
        return 'topic-' + this.id;
      }
    },
    member: {
      deps: ['author'],
      fn: function () {
        return this.author;
      }
    },
    threadKind: {
      fn: function () {
        return 'topic';
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
    },
    postedTimeSpan: {
      deps: ['posted'],
      fn: function () {
        return timeSince(this.posted);
      },
      cache: false
    },
  },
  serialize: function () {
    var res = this.getAttributes({props: true}, true);
    _.each(this._children, function (value, key) {
        res[key] = this[key].serialize();
    }, this);
    _.each(this._collections, function (value, key) {
        res[key] = this[key].serialize();
    }, this);

    delete res.comments;
    delete res.unread;

    return res;
  }

});
