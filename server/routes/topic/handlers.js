var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;


exports.create = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    payload: {
      author: Joi.string().description('author of the topic'),
      text: Joi.string().description('text of the topic'),
      targets: Joi.array().description('targets of the topic'),
      kind: Joi.string().description('kind of the topic'),
      closed: Joi.boolean().description('closed of the topic'),
      result: Joi.string().description('result of the topic'),
      poll: {
        kind: Joi.string().description('kind of the poll'),
        options: Joi.array().description('options of the poll'),
      },
      duedate: Joi.date().description('duedate of the poll'),
      meetings: Joi.array().description('meetings the topic is associated to'),
      tags: Joi.array().description('tags of the topic'),
      root: Joi.string().description('root topic of this topic'),
    }
  },
  pre: [
    { method: 'topic.create(payload, auth.credentials.id)', assign: 'topic' }
    // TODO: GET TARGETS
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.topic).created('/api/topic/'+request.pre.topic.id);
  },
  description: 'Creates a new topic'
};


exports.update = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the topic we want to update'),
    },
    payload: {
      author: Joi.string().description('author of the topic'),
      text: Joi.string().description('text of the topic'),
      targets: Joi.array().description('targets of the topic'),
      kind: Joi.string().description('kind of the topic'),
      closed: Joi.boolean().description('closed of the topic'),
      result: Joi.string().description('result of the topic'),
      poll: {
        kind: Joi.string().description('kind of the poll'),
        options: Joi.array().description('options of the poll'),
      },
      duedate: Joi.date().description('duedate of the poll'),
      meetings: Joi.array().description('meetings the topic is associated to'),
      tags: Joi.array().description('tags of the topic'),
      root: Joi.string().description('root topic of this topic'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'topic.update(params.id, payload)', assign: 'topic' }
    // TODO: GET TARGETS
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.topic);
  },
  description: 'Updates an topic'
};


exports.get = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the topic we want to retrieve'),
    }
  },
  pre: [
    { method: 'topic.get(params.id)', assign: 'topic' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.topic);
  },
  description: 'Gets an topic'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the member'),
    }
  },
  pre: [
    { method: 'topic.getByMember(params.id)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(request.pre.topics);
  },
  description: 'Gets topics of a given member'
};


exports.findByTag = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the tag'),
    }
  },
  pre: [
    { method: 'topic.findByTag(params.id)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(request.pre.topics);
  },
  description: 'Gets topics of a given tag'
};


exports.getByMeeting = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the meeting'),
    }
  },
  pre: [
    { method: 'topic.getByMeeting(params.id)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(request.pre.topics);
  },
  description: 'Gets topics of a given meeting'
};


exports.list = {
  auth: 'session',
  tags: ['api','topic'],
  pre: [
    { method: 'topic.list()', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(request.pre.topics);
  },
  description: 'Gets all the topics'
};


exports.remove = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the topic we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
     // TODO: REMOVE COMMENTS
     // TODO: REMOVE COMMUNICATIONS
    }
  },
  pre: [
    { method: 'topic.remove(params.id)', assign: 'topic' }
  ],
  handler: function (request, reply) {
    reply(request.pre.topic);
  },
  description: 'Removes an topic'
};
