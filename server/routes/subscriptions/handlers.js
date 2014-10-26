var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','subscription'],
  validate: {
    payload: {
      thread: Joi.string().required().description('thread of the subscription'),
    }
  },
  pre: [
    { method: 'subscription.create(payload.thread, auth.credentials.id)', assign: 'subscription' }
  ],
  handler: function (request, reply) {
    reply(request.pre.subscription);
  },
  description: 'Creates a new subscription'
};


exports.get = {
  auth: 'session',
  tags: ['api','subscription'],
  validate: {
    query: {
      thread: Joi.string().description('thread of the subscription'),
    }
  },
  pre: [
    { method: 'subscription.get(query.thread, auth.credentials.id)', assign: 'subscription' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.subscription);
  },
  description: 'Gets an subscription'
};


exports.remove = {
  auth: 'session',
  tags: ['api','subscription'],
  validate: {
    payload: {
      thread: Joi.string().required().description('thread of the subscription'),
    }
  },
  pre: [
    { method: 'subscription.remove(payload.thread, auth.credentials.id)', assign: 'subscription' }
  ],
  handler: function (request, reply) {
    reply(request.pre.subscription);
  },
  description: 'Removes an subscription'
};
