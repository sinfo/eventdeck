var Joi = require('joi')
var render = require('../../views/topic')
var options = require('../../../options')

var topicKinds = options.kinds.topics.map(function (t) { return t.id })

exports = module.exports

exports.create = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    payload: {
      kind: Joi.string().required().valid(topicKinds).description('kind of the topic'),
      name: Joi.string().description('name of the topic'),
      text: Joi.string().description('text of the topic (can be markdown)'),
      targets: Joi.array().includes(Joi.string()).description('targets of the topic'),
      closed: Joi.boolean().description('closed of the topic'),
      poll: {
        kind: Joi.string().valid('text', 'images').description('kind of the poll'),
        options: Joi.array().includes(Joi.object().keys({
          content: Joi.string().description('content of the option - can be image url or text'),
          votes: Joi.array().includes(Joi.string()).description('members who voted for this option')
        })).description('options of the poll')
      },
      duedate: Joi.date().description('duedate of the poll'),
      tags: Joi.array().includes(Joi.string()).description('tags of the topic')
    }
  },
  pre: [
    { method: 'topic.create(payload, auth.credentials.id)', assign: 'topic' },
    { method: 'subscription.create(pre.topic.thread, auth.credentials.id)', assign: 'subscription' },
    { method: 'subscription.createForCoordinators(pre.topic.thread)', assign: 'coordinatorSubscriptions' },
    { method: 'notification.notifyCreate(auth.credentials.id, path, pre.topic)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcast' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic)).created('/api/topics/' + request.pre.topic.id)
  },
  description: 'Creates a new topic'
}

exports.update = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the topic we want to update')
    },
    payload: {
      kind: Joi.string().valid(topicKinds).description('kind of the topic'),
      name: Joi.string().description('name of the topic'),
      text: Joi.string().description('text of the topic'),
      author: Joi.string().description('author of the topic'),
      targets: Joi.array().includes(Joi.string()).description('targets of the topic'),
      closed: Joi.boolean().description('closed of the topic'),
      poll: {
        kind: Joi.string().valid('text', 'images').description('kind of the poll'),
        options: Joi.array().includes(Joi.object().keys({
          content: Joi.string().description('content of the option - can be image url or text'),
          votes: Joi.array().includes(Joi.string()).description('members who voted for this option')
        })).description('options of the poll')
      },
      duedate: Joi.date().description('duedate of the poll'),
      tags: Joi.array().includes(Joi.string()).description('tags of the topic')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'topic.update(params.id, payload)', assign: 'topic' },
    { method: 'notification.notifyUpdate(auth.credentials.id, path, pre.topic)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcast' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic))
  },
  description: 'Updates an topic'
}

exports.get = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve')
    },
    params: {
      id: Joi.string().required().description('id of the topic we want to retrieve')
    }
  },
  pre: [
    { method: 'topic.get(params.id,query)', assign: 'topic' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic))
  },
  description: 'Gets an topic'
}

exports.getByMember = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    },
    params: {
      id: Joi.string().required().description('id of the member')
    }
  },
  pre: [
    { method: 'topic.getByMember(params.id,query)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topics))
  },
  description: 'Gets topics of a given member'
}

exports.findByTag = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the tag')
    }
  },
  pre: [
    { method: 'topic.findByTag(params.id)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topics))
  },
  description: 'Gets topics of a given tag'
}

exports.list = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'topic.list(query)', assign: 'topics' },
    { method: 'notification.decorateWithUnreadStatus(auth.credentials.id, pre.topics)', assign: 'topics' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topics))
  },
  description: 'Gets all the topics'
}

exports.remove = {
  auth: 'session',
  tags: ['api', 'topic'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the topic we want to remove')
    }
  },
  pre: [
    // { method: 'authorization.isAdmin(auth.credentials)' },
    { method: 'topic.remove(params.id)', assign: 'topic' },
    { method: 'notification.removeByThread(path, params.id)' },
    { method: 'comment.removeByThread(path, params.id)' },
    { method: 'communication.removeByThread(path, params.id)' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.topic))
  },
  description: 'Removes an topic'
}
