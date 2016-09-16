var Joi = require('joi')
var render = require('server/views/notification')

exports = module.exports

exports.get = {
  auth: 'session',
  tags: ['api', 'notification'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the notification we want to retrieve')
    }
  },
  pre: [
    { method: 'notification.get(params.id)', assign: 'notification' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.notification))
  },
  description: 'Gets an notification'
}

exports.getByMember = {
  auth: 'session',
  tags: ['api', 'notification'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    },
    params: {
      id: Joi.string().required().description('Id of the member')
    }
  },
  pre: [
    { method: 'notification.getByMember(params.id,query)', assign: 'notifications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.notifications))
  },
  description: 'Gets notifications of a given member'
}

exports.getByThread = {
  auth: 'session',
  tags: ['api', 'notification'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    },
    params: {
      id: Joi.string().required().description('Id of the thread')
    }
  },
  pre: [
    { method: 'notification.getByThread(path, params.id,query)', assign: 'notifications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.notifications))
  },
  description: 'Gets notifications of a given thread'
}

exports.list = {
  auth: 'session',
  tags: ['api', 'notification'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'notification.list(query)', assign: 'notifications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.notifications))
  },
  description: 'Gets all the notifications'
}
