var Joi = require('joi');
var log = require('server/helpers/logger');
var render = require('server/views/speaker');


var handlers = module.exports;

// TODO: EMAIL TRACKER

exports.create = {
  auth: 'session',
  tags: ['api','speaker'],
  validate: {
    payload: {
      id: Joi.string().description('id of the speaker'),
      name: Joi.string().required().description('name of the speaker'),
      title: Joi.string().description('title of the speaker'),
      description: Joi.string().description('description of the speaker'),
      img: Joi.string().description('image of the speaker'),
      url: Joi.string().description('url of the speaker'),
      contacts: Joi.string().description('contacts of the speaker'),
      participations: Joi.array().description('participations of the speaker'),
      updated: Joi.date().description('date the speaker was last updated'),
    }
  },
  pre: [
    { method: 'speaker.create(payload, auth.credentials.id)', assign: 'speaker' },
    { method: 'subscription.create(pre.speaker.thread, auth.credentials.id)', assign: 'subscription' },
    { method: 'notification.notifyCreate(auth.credentials.id, path, pre.speaker)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcast'}
  ],
  handler: function (request, reply) {
    reply(render(request.pre.speaker)).created('/api/speakers/'+request.pre.speaker.id);
  },
  description: 'Creates a new speaker'
};


exports.update = {
  auth: 'session',
  tags: ['api','speaker'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the speaker we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the speaker'),
      name: Joi.string().description('name of the speaker'),
      title: Joi.string().description('title of the speaker'),
      description: Joi.string().description('description of the speaker'),
      img: Joi.string().description('image of the speaker'),
      url: Joi.string().description('url of the speaker'),
      contacts: Joi.string().description('contacts of the speaker'),
      participations: Joi.array().description('participations of the speaker'),
      updated: Joi.date().description('date the speaker was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'speaker.update(params.id, payload)', assign: 'speaker' },
    { method: 'notification.notifyUpdate(auth.credentials.id, path, pre.speaker)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcast'}
    // TODO: EMAIL IF MEMBER NECESSARY FOR NEW MEMBER
  ],
  handler: function (request, reply) {
    reply(render(request.pre.speaker));
  },
  description: 'Updates an speaker'
};


exports.get = {
  auth: 'session',
  tags: ['api','speaker'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
  },
    params: {
      id: Joi.string().required().description('id of the speaker we want to retrieve'),
    }
  },
  pre: [
    { method: 'speaker.get(params.id,query)', assign: 'speaker' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.speaker));
  },
  description: 'Gets an speaker'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','speaker'],
   validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    },
    params: {
      id: Joi.string().required().description('id of the member'),
    }
  },
  pre: [
    { method: 'speaker.getByMember(params.id,query)', assign: 'speakers' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.speakers));
  },
  description: 'Gets speakers of a given member'
};


exports.list = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api','speaker'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'speaker.list(query)', assign: 'speakers' },
    { method: 'notification.decorateWithUnreadStatus(auth.credentials.id, pre.speakers)', assign: 'speakers' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.speakers, request.auth.isAuthenticated));
  },
  cors: true,
  description: 'Gets all the speakers'
};


exports.remove = {
  auth: 'session',
  tags: ['api','speaker'],
  validate: {
    params: {
     id: Joi.string().required().description('id of the speaker we want to remove'),
    }
  },
  pre: [
    { method: 'authorization.isAdmin(auth.credentials)' },
    { method: 'speaker.remove(params.id)', assign: 'speaker' },
    { method: 'notification.removeByThread(path, params.id)' },
    { method: 'comment.removeByThread(path, params.id)' },
    { method: 'communication.removeByThread(path, params.id)' },
  ],
  handler: function (request, reply) {
    reply(render(request.pre.speaker));
  },
  description: 'Removes an speaker'
};
