const Joi = require('joi')
const render = require('../../views/comment')

exports = module.exports

exports.create = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      threadKind: Joi.string().description('Kind of the thread of the communication we want to update'),
      threadId: Joi.string().description('Id of the thread of the communication we want to update')
    },
    payload: {
      thread: Joi.string().required().description('Thread of the comment'),
      subthread: Joi.string().description('Thread of the comment'),
      text: Joi.string().description('Text of the comment')
    }
  },
  pre: [
    { method: 'comment.create(payload, auth.credentials.id)', assign: 'comment' },
    { method: 'notification.notifyComment(auth.credentials.id, payload.thread, pre.comment._id)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcastNotification' },
    { method: 'parser.members(payload.text, payload.thread, pre.comment._id, auth.credentials.id)', assign: 'mention' },
    { method: 'notification.broadcast(pre.mention)', assign: 'broadcastMention' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment)).created('/api/comments/' + request.pre.comment._id)
  },
  description: 'Creates a new comment'
}

exports.update = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the comment we want to update'),
      threadKind: Joi.string().description('Kind of the thread of the communication we want to update'),
      threadId: Joi.string().description('Id of the thread of the communication we want to update')
    },
    payload: {
      text: Joi.string().description('Text of the comment')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'comment.update(params.id, payload)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment))
  },
  description: 'Updates an comment'
}

exports.get = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the comment we want to retrieve'),
      threadKind: Joi.string().description('Kind of the thread of the communication we want to update'),
      threadId: Joi.string().description('Id of the thread of the communication we want to update')
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve')
    }
  },
  pre: [
    { method: 'comment.get(params.id,query)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment))
  },
  description: 'Gets an comment'
}

exports.getByMember = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the member')
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'comment.getByMember(params.id,query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comments))
  },
  description: 'Gets comments of a given member'
}

exports.getByThread = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the thread')
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'comment.getByThread(path, params.id,query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comments))
  },
  description: 'Gets comments of a given thread'
}

exports.getBySubthread = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the subthread')
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'comment.getBySubthread(path, params.id,query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comments))
  },
  description: 'Gets comments of a given subthread'
}

exports.list = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'comment.list(query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comments))
  },
  description: 'Gets all the comments'
}

exports.remove = {
  auth: 'session',
  tags: ['api', 'comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the comment we want to remove'),
      threadKind: Joi.string().description('Kind of the thread of the communication we want to update'),
      threadId: Joi.string().description('Id of the thread of the communication we want to update')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'comment.remove(params.id)', assign: 'comment' },
    { method: 'notification.removeBySource(params.id)' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment))
  },
  description: 'Removes an comment'
}
