var Joi = require('joi');
var log = require('server/helpers/logger');
var render = require('server/views/communication')


var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    payload: {
      thread: Joi.string().required().description('Thread of the communication'),
      event: Joi.string().description('Event of the communication'),
      kind: Joi.string().description('Kind of the communication'),
      text: Joi.string().description('Text of the communication'),
    }
  },
  pre: [
    { method: 'communication.create(payload, auth.credentials.id)', assign: 'communication' }
    // TODO: CREATE NOTIFICATION
    // TODO: PARSE FOR MEMBERS
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communication)).created('/communications/'+request.pre.communication._id);
  },
  description: 'Creates a new communication'
};


exports.update = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the communication we want to update'),
    },
    payload: {
      kind: Joi.string().description('Kind of the communication'),
      text: Joi.string().description('Text of the communication'),
      status: Joi.string().description('Status of the communication'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'communication.update(params.id, payload)', assign: 'communication' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communication));
  },
  description: 'Updates an communication'
};


exports.get = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the communication we want to retrieve'),
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
    }
  },
  pre: [
    { method: 'communication.get(params.id,query)', assign: 'communication' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communication));
  },
  description: 'Gets an communication'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','communication'],
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
    { method: 'communication.getByMember(params.id,query)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communications));
  },
  description: 'Gets communications of a given member'
};


exports.getByThread = {
  auth: 'session',
  tags: ['api','communication'],
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
    { method: 'communication.getByThread(path, params.id,query)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communications));
  },
  description: 'Gets communications of a given thread'
};

exports.getByEvent = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the event'),
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'communication.getByEvent(params.id,query)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communications));
  },
  description: 'Gets communications of a given event'
};


exports.list = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'communication.list(query)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communications));
  },
  description: 'Gets all the communications'
};


exports.remove = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
     id: Joi.string().required().description('Id of the communication we want to remove'),
    }
  },
  pre: [
     // TODO: CHECK PERMISSIONS
    { method: 'communication.remove(params.id)', assign: 'communication' }
     // TODO: REMOVE NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(render(request.pre.communication));
  },
  description: 'Removes an communication'
};
