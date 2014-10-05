var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.get = {
  auth: true,
  validate: {
    params: {
      id: Joi.string().required().description('id of the message we want to retrieve'),
    }
  },
  pre: [
    { method: 'message.get(params.id)', assign: 'message' }
  ],
  handler: function (request, reply) {
    reply(request.pre.message);
  },
  description: 'Gets an message'
};


exports.list = {
  auth: true,
  pre: [
    { method: 'message.list()', assign: 'messages' }
  ],
  handler: function (request, reply) {
    reply(request.pre.messages);
  },
  description: 'Gets all the messages'
};