var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

// TODO: GET LAST EVENT

exports.create = {
  auth: 'session',
  tags: ['api','event'],
  validate: {
    payload: {
      id: Joi.string().description('id of the event'),
      name: Joi.string().required().description('name of the event'),
      kind: Joi.string().description('kind of the event'),
      description: Joi.string().description('description of the event'),
      date: Joi.date().description('date of the event'),
      duration: Joi.date().description('duration of the event'),
      updated: Joi.date().description('date the event was last updated'),
    }
  },
  pre: [
    { method: 'event.create(payload, auth.credentials.id)', assign: 'event' }
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.event).created('/api/events/'+request.pre.event.id);
  },
  description: 'Creates a new event'
};


exports.update = {
  auth: 'session',
  tags: ['api','event'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the event we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the event'),
      name: Joi.string().description('name of the event'),
      kind: Joi.string().description('kind of the event'),
      description: Joi.string().description('description of the event'),
      date: Joi.date().description('date of the event'),
      duration: Joi.date().description('duration of the event'),
      updated: Joi.date().description('date the event was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'event.update(params.id, payload)', assign: 'event' }
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.event);
  },
  description: 'Updates an event'
};


exports.get = {
  auth: 'session',
  tags: ['api','event'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the event we want to retrieve'),
    },
    query: {
      fields: Joi.string().default('id,name,kind,date').description('Fields we want to retrieve'),
    }
  },
  pre: [
    { method: 'event.get(params.id, query.fields)', assign: 'event' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.event);
  },
  description: 'Gets an event'
};


exports.list = {
  auth: 'session',
  tags: ['api','event'],
  validate: {
    query: {
      fields: Joi.string().default('id,name,kind,date').description('Fields we want to retrieve'),
    }
  },
  pre: [
    { method: 'event.list(query.fields)', assign: 'events' }
  ],
  handler: function (request, reply) {
    reply(request.pre.events);
  },
  description: 'Gets all the events'
};


exports.remove = {
  auth: 'session',
  tags: ['api','event'],
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('Id of the event we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
    }
  },
  pre: [
    { method: 'event.remove(params.id)', assign: 'event' }
  ],
  handler: function (request, reply) {
    reply(request.pre.event);
  },
  description: 'Removes an event'
};
