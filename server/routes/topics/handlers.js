var Joi = require('joi');
var log = require('server/helpers/logger');
var render = require('server/views/topic')


var handlers = module.exports;


exports.create = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    payload: {
      author: Joi.string().description('author of the topic'),
      text: Joi.string().description('text of the topic'),
      targets: Joi.array().description('targets of the topic'),
      kind: Joi.string().required().description('kind of the topic'),
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
    { method: 'topic.create(payload, auth.credentials.id)', assign: 'topic' },
    { method: 'notification.notifyCreate(auth.credentials.id, path, pre.topic)', assign: 'notification' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic)).created('/topics/'+request.pre.topic.id);
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
    { method: 'topic.update(params.id, payload)', assign: 'topic' },
    { method: 'notification.notifyUpdate(auth.credentials.id, path, pre.topic)', assign: 'notification' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic));
  },
  description: 'Updates an topic'
};


exports.get = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
    },
    params: {
      id: Joi.string().required().description('id of the topic we want to retrieve'),
    }
  },
  pre: [
    { method: 'topic.get(params.id,query)', assign: 'topic' },
    { method: 'access.save(auth.credentials.id, path, params.id)' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic));
  },
  description: 'Gets an topic'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
  },
    params: {
      id: Joi.string().required().description('id of the member'),
    }
  },
  pre: [
    { method: 'topic.getByMember(params.id,query)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topics));
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
    reply(render(request.pre.topics));
  },
  description: 'Gets topics of a given tag'
};


exports.getByMeeting = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    },
    params: {
      id: Joi.string().required().description('id of the meeting'),
    }
  },
  pre: [
    { method: 'topic.getByMeeting(params.id,query)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topics));
  },
  description: 'Gets topics of a given meeting'
};


exports.list = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'topic.list(query)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topics));
  },
  description: 'Gets all the topics'
};


exports.remove = {
  auth: 'session',
  tags: ['api','topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the topic we want to remove'),
    }
  },
  pre: [
    // { method: 'authorization.isAdmin(auth.credentials)' },
    { method: 'topic.remove(params.id)', assign: 'topic' },
    { method: 'notification.removeByThread(path, params.id)' },
    { method: 'comment.removeByThread(path, params.id)' },
    { method: 'communication.removeByThread(path, params.id)' },
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic));
  },
  description: 'Removes an topic'
};
