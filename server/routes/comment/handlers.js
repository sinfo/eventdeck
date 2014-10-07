var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    payload: {
      thread: Joi.string().required().description('Thread of the comment'),
      subthread: Joi.string().description('Thread of the comment'),
      member: Joi.string().description('Author of the comment'),
      markdown: Joi.string().description('Markdown of the comment'),
      html: Joi.string().description('Html of the comment'),
      posted: Joi.date().description('Date the comment was posted'),
      updated: Joi.date().description('Date the comment was last updated'),
    }
  },
  pre: [
    { method: 'comment.create(payload, auth.credentials.id)', assign: 'comment' }
    // TODO: GET TARGETS
    // TODO: CREATE NOTIFICATION
    // TODO: PARSE FOR MEMBERS
  ],
  handler: function (request, reply) {
    reply(request.pre.comment).created('/api/comment/'+request.pre.comment._id);
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
      thread: Joi.string().description('Thread of the comment'),
      subthread: Joi.string().description('Thread of the comment'),
      member: Joi.string().description('Author of the comment'),
      markdown: Joi.string().description('Markdown of the comment'),
      html: Joi.string().description('Html of the comment'),
      posted: Joi.date().description('Date the comment was posted'),
      updated: Joi.date().description('Date the comment was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'comment.update(params.id, payload)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(request.pre.comment);
  },
  description: 'Updates an comment'
};


exports.get = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the comment we want to retrieve'),
    }
  },
  pre: [
    { method: 'comment.get(params.id)', assign: 'comment' }
  ],
  handler: function (request, reply) {
    reply(request.pre.comment);
  },
  description: 'Gets an comment'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','comment'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the member'),
    }
  },
  pre: [
    { method: 'comment.getByMember(params.id)', assign: 'comments' }
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
    }
  },
  pre: [
    { method: 'comment.getByThread(path, params.id)', assign: 'comments' }
  ],
  handler: function (request, reply) {
    reply(request.pre.comments);
  },
  description: 'Gets comments of a given thread'
};


exports.list = {
  auth: 'session',
  tags: ['api','comment'],
  pre: [
    { method: 'comment.list()', assign: 'comments' }
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
    reply(request.pre.comment);
  },
  description: 'Removes an comment'
};
