var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.get = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('Id of the notification we want to retrieve'),
    }
  },
  pre: [
    { method: 'notification.get(params.id)', assign: 'notification' }
  ],
  handler: function (request, reply) {
    reply(request.pre.notification);
  },
  description: 'Gets an notification'
};


exports.getByMember = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('Id of the member'),
    }
  },
  pre: [
    { method: 'notification.getByMember(params.id)', assign: 'notifications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.notifications);
  },
  description: 'Gets notifications of a given member'
};


exports.getByThread = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('Id of the thread'),
    }
  },
  pre: [
    { method: 'notification.getByThread(path, params.id)', assign: 'notifications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.notifications);
  },
  description: 'Gets notifications of a given thread'
};

exports.list = {
  auth: 'session',
  pre: [
    { method: 'notification.list()', assign: 'notifications' }
  ],
  handler: function (request, reply) {
    reply(request.pre.notifications);
  },
  description: 'Gets all the notifications'
};
