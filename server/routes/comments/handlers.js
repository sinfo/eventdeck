var Joi = require('joi');
var log = require('server/helpers/logger');
var render = require('server/views/comment')

var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    payload: {
      thread: Joi.string().required().description('Thread of the comment'),
      subthread: Joi.string().description('Thread of the comment'),
      text: Joi.string().description('Text of the comment'),
    }
  },
  pre: [
    { method: 'comment.create(payload, auth.credentials.id)', assign: 'comment' }
    // TODO: CREATE NOTIFICATION
    // TODO: PARSE FOR MEMBERS
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment)).created('/comments/'+request.pre.comment._id);
  },
  description: 'Creates a new comment'
};


exports.update = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the comment we want to update'),
    },
    payload: {
      text: Joi.string().description('Text of the comment'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'comment.update(params.id, payload)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment));
  },
  description: 'Updates an comment'
};


exports.get = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the comment we want to retrieve'),
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
    }   
  },
  pre: [
    { method: 'comment.get(params.id,query)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment));
  },
  description: 'Gets an comment'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the member'),
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'comment.getByMember(params.id,query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(request.pre.comments);
  },
  description: 'Gets comments of a given member'
};


exports.getByThread = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the thread'),
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'comment.getByThread(path, params.id,query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(request.pre.comments);
  },
  description: 'Gets comments of a given thread'
};


exports.list = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'comment.list(query)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(request.pre.comments);
  },
  description: 'Gets all the comments'
};


exports.remove = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('Id of the comment we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
    }
  },
  pre: [
    { method: 'comment.remove(params.id)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.comment));
  },
  description: 'Removes an comment'
};
