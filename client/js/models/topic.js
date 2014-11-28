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
    duedate: 'date',
    tags: 'array',
    posted: 'date',
    updated: 'date',
  },
  children: {
    poll: Poll
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

