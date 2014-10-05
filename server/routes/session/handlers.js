var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: true,
  validate: {
    payload: {
      id: Joi.string().description('id of the session'),
      name: Joi.string().required().description('name of the session'),
      kind: Joi.string().description('kind of the session'),
      img: Joi.string().description('image of the session'),
      place: Joi.string().description('place of the session'),
      description: Joi.string().description('description of the session'),
      speakers: Joi.array().description('speakers associated to the session'),
      companies: Joi.array().description('companies associated to the session'),
      date: Joi.date().description('start date of the session'),
      duration: Joi.date().description('duration of the session'),
      updated: Joi.date().description('date the session was last updated'),
    }
  },
  pre: [
    { method: 'session.create(payload, auth.credentials.id)', assign: 'session' }
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.session).created('/api/session/'+request.pre.session.id);
  },
  description: 'Creates a new session'
};


exports.update = {
  auth: true,
  validate: {
    params: {
      id: Joi.string().required().description('id of the session we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the session'),
      name: Joi.string().required().description('name of the session'),
      kind: Joi.string().description('kind of the session'),
      img: Joi.string().description('image of the session'),
      place: Joi.string().description('place of the session'),
      description: Joi.string().description('description of the session'),
      speakers: Joi.array().description('speakers associated to the session'),
      companies: Joi.array().description('companies associated to the session'),
      date: Joi.date().description('start date of the session'),
      duration: Joi.date().description('duration of the session'),
      updated: Joi.date().description('date the session was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'session.update(params.id, payload)', assign: 'session' }
    // TODO: CREATE NOTIFICATION ?
  ],
  handler: function (request, reply) {
    reply(request.pre.session);
  },
  description: 'Updates an session'
};


exports.get = {
  auth: true,
  validate: {
    params: {
      id: Joi.string().required().description('id of the session we want to retrieve'),
    }
  },
  pre: [
    { method: 'session.get(params.id)', assign: 'session' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.session);
  },
  description: 'Gets an session'
};


exports.list = {
  auth: true,
  pre: [
    { method: 'session.list()', assign: 'sessions' }
  ],
  handler: function (request, reply) {
    reply(request.pre.sessions);
  },
  description: 'Gets all the sessions'
};


exports.remove = {
  auth: true,
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the session we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
    }
  },
  pre: [
    { method: 'session.remove(params.id)', assign: 'session' }
  ],
  handler: function (request, reply) {
    reply(request.pre.session);
  },
  description: 'Removes an session'
};
