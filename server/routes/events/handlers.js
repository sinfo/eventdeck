const Joi = require('joi')
const render = require('../../views/event')

exports = module.exports

// TODO: GET LAST EVENT

exports.create = {
  auth: 'session',
  tags: ['api', 'event'],
  validate: {
    payload: {
      id: Joi.string().description('id of the event'),
      name: Joi.string().required().description('name of the event'),
      kind: Joi.string().description('kind of the event'),
      description: Joi.string().description('description of the event'),
      date: Joi.date().description('date of the event'),
      duration: Joi.date().description('duration of the event'),
      updated: Joi.date().description('date the event was last updated')
    }
  },
  pre: [
    { method: 'event.create(payload, auth.credentials.id)', assign: 'event' }
  // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(render(request.pre.event)).created('/api/events/' + request.pre.event.id)
  },
  description: 'Creates a new event'
}

exports.update = {
  auth: 'session',
  tags: ['api', 'event'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the event we want to update')
    },
    payload: {
      id: Joi.string().description('id of the event'),
      name: Joi.string().description('name of the event'),
      kind: Joi.string().description('kind of the event'),
      description: Joi.string().description('description of the event'),
      date: Joi.date().description('date of the event'),
      duration: Joi.date().description('duration of the event'),
      updated: Joi.date().description('date the event was last updated')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'event.update(params.id, payload)', assign: 'event' }
  // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(render(request.pre.event))
  },
  description: 'Updates an event'
}

exports.get = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api', 'event'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    params: {
      id: Joi.string().required().description('id of the event we want to retrieve')
    },
    query: {
      fields: Joi.string().description('Fields we want to retrieve')
    }
  },
  pre: [
    { method: 'event.get(params.id, query)', assign: 'event' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.event, request.auth.isAuthenticated && !request.headers['Only-Public']))
  },
  description: 'Gets an event'
}

exports.list = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api', 'event'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    query: {
      fields: Joi.string().description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'event.list(query)', assign: 'events' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.events, request.auth.isAuthenticated && !request.headers['Only-Public']))
  },
  description: 'Gets all the events'
}

exports.remove = {
  auth: 'session',
  tags: ['api', 'event'],
  validate: {
    params: {
      // TODO: CHECK PERMISSIONS
      id: Joi.string().required().description('Id of the event we want to remove')
    // TODO: REMOVE NOTIFICATIONS
    }
  },
  pre: [
    { method: 'event.remove(params.id)', assign: 'event' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.event))
  },
  description: 'Removes an event'
}
