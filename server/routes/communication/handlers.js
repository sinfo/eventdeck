var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    payload: {
      thread: Joi.string().required().description('Thread of the communication'),
      event: Joi.string().description('Event of the communication'),
      kind: Joi.string().description('Kind of the communication'),
      member: Joi.string().description('Author of the communication'),
      text: Joi.string().description('Text of the communication'),
      status: Joi.string().description('Status of the communication'),
      approved: Joi.boolean().description('Approved of the communication'),
      posted: Joi.date().description('Date the communication was posted'),
      updated: Joi.date().description('Date the communication was last updated'),
    }
  },
  pre: [
    { method: 'communication.create(payload, auth.credentials.id)', assign: 'communication' }
    // TODO: GET TARGETS
    // TODO: CREATE NOTIFICATION
    // TODO: PARSE FOR MEMBERS
  ],
  handler: function (request, reply) {
    reply(request.pre.communication).created('/api/communication/'+request.pre.communication._id);
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
      thread: Joi.string().description('Thread of the communication'),
      event: Joi.string().description('Event of the communication'),
      kind: Joi.string().description('Kind of the communication'),
      member: Joi.string().description('Author of the communication'),
      text: Joi.string().description('Text of the communication'),
      status: Joi.string().description('Status of the communication'),
      approved: Joi.boolean().description('Approved of the communication'),
      posted: Joi.date().description('Date the communication was posted'),
      updated: Joi.date().description('Date the communication was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'communication.update(params.id, payload)', assign: 'communication' }
  ],
  handler: function (request, reply) {
    reply(request.pre.communication);
  },
  description: 'Updates an communication'
};


exports.get = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the communication we want to retrieve'),
    }
  },
  pre: [
    { method: 'communication.get(params.id)', assign: 'communication' }
  ],
  handler: function (request, reply) {
    reply(request.pre.communication);
  },
  description: 'Gets an communication'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the member'),
    }
  },
  pre: [
    { method: 'communication.getByMember(params.id)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.communications);
  },
  description: 'Gets communications of a given member'
};


exports.getByThread = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the thread'),
    }
  },
  pre: [
    { method: 'communication.getByThread(path, params.id)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.communications);
  },
  description: 'Gets communications of a given thread'
};

exports.getByEvent = {
  auth: 'session',
  tags: ['api','communication'],
  validate: {
    params: {
      id: Joi.string().required().description('Id of the event'),
    }
  },
  pre: [
    { method: 'communication.getByEvent(params.id)', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.communications);
  },
  description: 'Gets communications of a given event'
};


exports.list = {
  auth: 'session',
  tags: ['api','communication'],
  pre: [
    { method: 'communication.list()', assign: 'communications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.communications);
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
    reply(request.pre.communication);
  },
  description: 'Removes an communication'
};
