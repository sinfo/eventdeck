var Joi = require('joi')
var log = require('server/helpers/logger')
var render = require('server/views/item')

var handlers = module.exports

exports.create = {
  auth: 'session',
  tags: ['api', 'item'],
  validate: {
    payload: {
      id: Joi.string().description('id of the item'),
      name: Joi.string().required().description('name of the item'),
      img: Joi.string().description('image of the item'),
      description: Joi.string().description('description of the item'),
      price: Joi.number().description('price of the item'),
      minPrice: Joi.number().description('minimum price of the item')
    }
  },
  pre: [
    { method: 'item.create(payload, auth.credentials.id)', assign: 'item' }
  // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(render(request.pre.item)).created('/api/items/' + request.pre.item.id)
  },
  description: 'Creates a new item'
}

exports.update = {
  auth: 'session',
  tags: ['api', 'item'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the item we want to update')
    },
    payload: {
      id: Joi.string().description('id of the item'),
      name: Joi.string().required().description('name of the item'),
      img: Joi.string().description('image of the item'),
      description: Joi.string().description('description of the item'),
      price: Joi.number().description('price of the item'),
      minPrice: Joi.number().description('minimum price of the item')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'item.update(params.id, payload)', assign: 'item' }
  // TODO: CREATE NOTIFICATION ?
  ],
  handler: function (request, reply) {
    reply(render(request.pre.item))
  },
  description: 'Updates an item'
}

exports.get = {
  auth: 'session',
  tags: ['api', 'item'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the item we want to retrieve')
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve')
    }
  },
  pre: [
    { method: 'item.get(params.id,query)', assign: 'item' }
  // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(render(request.pre.item))
  },
  description: 'Gets an item'
}

exports.list = {
  auth: 'session',
  tags: ['api', 'item'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'item.list(query)', assign: 'items' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.items))
  },
  description: 'Gets all the items'
}

exports.remove = {
  auth: 'session',
  tags: ['api', 'item'],
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
    reply(render(request.pre.item))
  },
  description: 'Removes an item'
}
