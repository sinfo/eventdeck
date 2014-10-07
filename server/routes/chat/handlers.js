var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','chat'],
  validate: {
    payload: {
      id: Joi.string().description('Id of the chat'),
      name: Joi.string().description('Name of the chat'),
      members: Joi.array().description('Participants of the chat'),
      messages: Joi.array().description('Messages of the chat'),
      date: Joi.string().description('Markdown of the chat'),
    }
  },
  pre: [
    { method: 'chat.create(payload, auth.credentials.id)', assign: 'chat' }
  ],
  handler: function (request, reply) {
    reply(request.pre.chat).created('/api/chat/'+request.pre.chat._id);
  },
  description: 'Creates a new chat'
};


exports.update = {
  auth: 'session',
  tags: ['api','chat'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the chat we want to update'),
    },
    payload: {
      id: Joi.string().description('Id of the chat'),
      name: Joi.string().description('Name of the chat'),
      members: Joi.array().description('Participants of the chat'),
      messages: Joi.array().description('Messages of the chat'),
      date: Joi.string().description('Markdown of the chat'),
    }
  },
  pre: [
    { method: 'chat.update(params.id, payload)', assign: 'chat' }
  ],
  handler: function (request, reply) {
    reply(request.pre.chat);
  },
  description: 'Updates a chat'
};


exports.get = {
  auth: 'session',
  tags: ['api','chat'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the chat we want to retrieve'),
    }
  },
  pre: [
    { method: 'chat.get(params.id)', assign: 'chat' }
  ],
  handler: function (request, reply) {
    reply(request.pre.chat);
  },
  description: 'Gets a chat'
};


exports.list = {
  auth: 'session',
  tags: ['api','chat'],
  pre: [
    { method: 'chat.list()', assign: 'chats' }
  ],
  handler: function (request, reply) {
    reply(request.pre.chats);
  },
  description: 'Gets all the chats'
};


exports.remove = {
  auth: 'session',
  tags: ['api','chat'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the chat we want to remove'),
      // TODO: REMOVE MESSAGES
    }
  },
  pre: [
    { method: 'chat.remove(params.id)', assign: 'chat' }
  ],
  handler: function (request, reply) {
    reply(request.pre.chat);
  },
  description: 'Removes a chat'
};
