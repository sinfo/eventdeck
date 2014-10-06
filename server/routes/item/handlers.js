var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  validate: {
    payload: {
      id: Joi.string().description('id of the item'),
      name: Joi.string().required().description('name of the item'),
      img: Joi.string().description('image of the item'),
      description: Joi.string().description('description of the item'),
      price: Joi.number().description('price of the item'),
      minPrice: Joi.number().description('minimum price of the item'),
    }
  },
  pre: [
    { method: 'item.create(payload, auth.credentials.id)', assign: 'item' }
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.item).created('/api/item/'+request.pre.item.id);
  },
  description: 'Creates a new item'
};


exports.update = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the item we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the item'),
      name: Joi.string().required().description('name of the item'),
      img: Joi.string().description('image of the item'),
      description: Joi.string().description('description of the item'),
      price: Joi.number().description('price of the item'),
      minPrice: Joi.number().description('minimum price of the item'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'item.update(params.id, payload)', assign: 'item' }
    // TODO: CREATE NOTIFICATION ?
  ],
  handler: function (request, reply) {
    reply(request.pre.item);
  },
  description: 'Updates an item'
};


exports.get = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the item we want to retrieve'),
    }
  },
  pre: [
    { method: 'item.get(params.id)', assign: 'item' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.item);
  },
  description: 'Gets an item'
};


exports.list = {
  auth: 'session',
  pre: [
    { method: 'item.list()', assign: 'items' }
  ],
  handler: function (request, reply) {
    reply(request.pre.items);
  },
  description: 'Gets all the items'
};


exports.remove = {
  auth: 'session',
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the item we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
    }
  },
  pre: [
    { method: 'item.remove(params.id)', assign: 'item' }
  ],
  handler: function (request, reply) {
    reply(request.pre.item);
  },
  description: 'Removes an item'
};
