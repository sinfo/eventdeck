var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  validate: {
    payload: {
      id: Joi.string().description('id of the tag'),
      name: Joi.string().required().description('name of the tag'),
      color: Joi.string().description('color of the tag'),
    }
  },
  pre: [
    { method: 'tag.create(payload, auth.credentials.id)', assign: 'tag' }
  ],
  handler: function (request, reply) {
    reply(request.pre.tag).created('/api/tag/'+request.pre.tag.id);
  },
  description: 'Creates a new tag'
};


exports.update = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the tag we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the tag'),
      name: Joi.string().required().description('name of the tag'),
      color: Joi.string().description('color of the tag'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'tag.update(params.id, payload)', assign: 'tag' }
  ],
  handler: function (request, reply) {
    reply(request.pre.tag);
  },
  description: 'Updates an tag'
};


exports.get = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the tag we want to retrieve'),
    }
  },
  pre: [
    { method: 'tag.get(params.id)', assign: 'tag' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.tag);
  },
  description: 'Gets an tag'
};


exports.list = {
  auth: 'session',
  pre: [
    { method: 'tag.list()', assign: 'tags' }
  ],
  handler: function (request, reply) {
    reply(request.pre.tags);
  },
  description: 'Gets all the tags'
};


exports.remove = {
  auth: 'session',
  validate: {
    params: {
     id: Joi.string().required().description('id of the tag we want to remove'),
    }
  },
  pre: [
    { method: 'tag.remove(params.id)', assign: 'tag' }
  ],
  handler: function (request, reply) {
    reply(request.pre.tag);
  },
  description: 'Removes an tag'
};
