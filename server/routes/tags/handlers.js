var Joi = require('joi')
var render = require('../../views/tag')

exports = module.exports

exports.create = {
  auth: 'session',
  tags: ['api', 'tag'],
  validate: {
    payload: {
      id: Joi.string().description('id of the tag'),
      name: Joi.string().required().description('name of the tag'),
      color: Joi.string().description('color of the tag')
    }
  },
  pre: [
    { method: 'tag.create(payload, auth.credentials.id)', assign: 'tag' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.tag)).created('/api/tags/' + request.pre.tag.id)
  },
  description: 'Creates a new tag'
}

exports.update = {
  auth: 'session',
  tags: ['api', 'tag'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the tag we want to update')
    },
    payload: {
      id: Joi.string().description('id of the tag'),
      name: Joi.string().required().description('name of the tag'),
      color: Joi.string().description('color of the tag')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'tag.update(params.id, payload)', assign: 'tag' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.tag))
  },
  description: 'Updates an tag'
}

exports.get = {
  auth: 'session',
  tags: ['api', 'tag'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve')
    },
    params: {
      id: Joi.string().required().description('id of the tag we want to retrieve')
    }
  },
  pre: [
    { method: 'tag.get(params.id,query)', assign: 'tag' }
  // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(render(request.pre.tag))
  },
  description: 'Gets an tag'
}

exports.list = {
  auth: 'session',
  tags: ['api', 'tag'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }},
  pre: [
    { method: 'tag.list(query)', assign: 'tags' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.tags))
  },
  description: 'Gets all the tags'
}

exports.remove = {
  auth: 'session',
  tags: ['api', 'tag'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the tag we want to remove')
    }
  },
  pre: [
    { method: 'tag.remove(params.id)', assign: 'tag' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.tag))
  },
  description: 'Removes an tag'
}
