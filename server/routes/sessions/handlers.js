var Joi = require('joi');
var log = require('server/helpers/logger');
var render = require('server/views/session');
var ical = require('server/helpers/ical');
var config = require('config');
var fs = require('fs');
var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','session'],
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
      tickets: {
        needed: Joi.boolean().description('Says if the session has tickets or not'),
        start: Joi.date().description('The date when the tickets become available'),
        end: Joi.date().description('The closing date for getting tickets'),
        max: Joi.number().description('Number max of tickets to be distributed'),
      },
    }
  },
  pre: [
    { method: 'session.create(payload, auth.credentials.id)', assign: 'session' }
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(render(request.pre.session)).created('/api/sessions/'+request.pre.session.id);
  },
  description: 'Creates a new session'
};


exports.update = {
  auth: 'session',
  tags: ['api','session'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the session we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the session'),
      name: Joi.string().description('name of the session'),
      kind: Joi.string().description('kind of the session'),
      img: Joi.string().description('image of the session'),
      place: Joi.string().description('place of the session'),
      description: Joi.string().description('description of the session'),
      speakers: Joi.array().description('speakers associated to the session'),
      companies: Joi.array().description('companies associated to the session'),
      date: Joi.date().description('start date of the session'),
      duration: Joi.date().description('duration of the session'),
      tickets: {
        needed: Joi.boolean().description('Says if the session has tickets or not'),
        start: Joi.date().description('The date when the tickets become available'),
        end: Joi.date().description('The closing date for getting tickets'),
        max: Joi.number().description('Number max of tickets to be distributed'),
      },
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'session.update(params.id, payload)', assign: 'session' }
    // TODO: CREATE NOTIFICATION ?
  ],
  handler: function (request, reply) {
    reply(render(request.pre.session));
  },
  description: 'Updates an session'
};


exports.get = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api','session'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
    },
    params: {
      id: Joi.string().required().description('id of the session we want to retrieve'),
    }
  },
  pre: [
    { method: 'session.get(params.id,query)', assign: 'session' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.session, request.auth.isAuthenticated && !request.headers['Only-Public']));
  },
  description: 'Gets an session'
};


exports.list = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api','session'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'session.list(query)', assign: 'sessions' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.sessions, request.auth.isAuthenticated && !request.headers['Only-Public']));
  },
  description: 'Gets all the sessions'
};


exports.remove = {
  auth: 'session',
  tags: ['api','session'],
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
    reply(render(request.pre.session));
  },
  description: 'Removes an session'
};

exports.getIcal = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api','session'],
  handler: function (request, reply) {
    var icalPath = config.ical.path;
    
    fs.exists(icalPath, function (exists) {
      if (exists) {
        reply.file(icalPath);
      } else {
        ical.generate(function (err, data) {
          if (err) {
            //todo
            return;
          }
          
          reply.File(icalPath);
        });
      }
    });
  },
  description: 'Gets an iCal'
};
