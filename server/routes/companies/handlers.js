var Joi = require('joi')
var log = require('server/helpers/logger')
var render = require('server/views/company')

var handlers = module.exports

// TODO: SPONSOR PAGE TRACKER
// TODO: EMAIL TRACKER

exports.create = {
  auth: 'session',
  tags: ['api', 'company'],
  validate: {
    payload: {
      id: Joi.string().description('id of the company'),
      name: Joi.string().required().description('name of the company'),
      description: Joi.string().description('description of the company'),
      img: Joi.string().description('image of the company'),
      site: Joi.string().description('site of the company'),
      contacts: Joi.string().description('contacts of the company'),
      history: Joi.string().description('history of the company'),
      area: Joi.string().description('area of the company'),
      participations: Joi.array().description('participations of the company'),
      accesses: Joi.array().description('accesses of the company'),
      updated: Joi.date().description('date the company was last updated')
    }
  },
  pre: [
    { method: 'company.create(payload, auth.credentials.id)', assign: 'company' },
    { method: 'subscription.create(pre.company.thread, auth.credentials.id)', assign: 'subscription' },
    { method: 'subscription.createForCoordinators(pre.company.thread)', assign: 'coordinatorSubscriptions' },
    { method: 'notification.notifyCreate(auth.credentials.id, path, pre.company)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcast'}
  ],
  handler: function (request, reply) {
    reply(render(request.pre.company)).created('/api/companies/' + request.pre.company.id)
  },
  description: 'Creates a new company'
}

exports.update = {
  auth: 'session',
  tags: ['api', 'company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the company we want to update')
    },
    payload: {
      id: Joi.string().description('id of the company'),
      name: Joi.string().description('name of the company'),
      description: Joi.string().description('description of the company'),
      img: Joi.string().description('image of the company'),
      site: Joi.string().description('site of the company'),
      contacts: Joi.string().description('contacts of the company'),
      history: Joi.string().description('history of the company'),
      area: Joi.string().description('area of the company'),
      participations: Joi.array().description('participations of the company'),
      accesses: Joi.array().description('accesses of the company'),
      updated: Joi.date().description('date the company was last updated')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'company.update(params.id, payload)', assign: 'company' },
    { method: 'notification.notifyUpdate(auth.credentials.id, path, pre.company)', assign: 'notification' },
    { method: 'notification.broadcast(pre.notification)', assign: 'broadcast'}
  // TODO: EMAIL IF MEMBER NECESSARY FOR NEW MEMBER
  ],
  handler: function (request, reply) {
    reply(render(request.pre.company))
  },
  description: 'Updates an company'
}

exports.get = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api', 'company'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    params: {
      id: Joi.string().required().description('id of the company we want to retrieve')
    },
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve')
    }
  },
  pre: [
    { method: 'company.get(params.id, query)', assign: 'company' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.company, request.auth.isAuthenticated && !request.headers['Only-Public']))
  },
  description: 'Gets an company'
}

exports.getByMember = {
  auth: 'session',
  tags: ['api', 'company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the member')
    },
    query: {
      fields: Joi.string().default('id,name,img').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'company.getByMember(params.id, query)', assign: 'companies' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.companies))
  },
  description: 'Gets companies of a given member'
}

exports.getByEvent = {
  auth: 'session',
  tags: ['api', 'company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the event')
    },
    query: {
      fields: Joi.string().default('id,name,img').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }
  },
  pre: [
    { method: 'company.getByEvent(params.id, query)', assign: 'companies' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.companies))
  },
  description: 'Gets companies associated to a given event'
}

exports.list = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api', 'company'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    query: {
      fields: Joi.string().description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
      event: Joi.string().description('Select companies assigned to a specific event'),
      member: Joi.alternatives().try(
        Joi.boolean().valid(false),
        Joi.string()
      ).description('Select companies assigned to a specific user'),
      participations: Joi.boolean().default(true).description('Based on member & event selects thow who are or not in the group')
    }
  },
  pre: [
    { method: 'company.list(query)', assign: 'companies' },
    { method: 'notification.decorateWithUnreadStatus(auth.credentials.id, pre.companies)', assign: 'companies' }
  ],
  handler: function (request, reply) {
    // Because in public views, when an event is selected, we want to address that participation
    var selectedEvent = request.query && request.query.event
    reply(render(request.pre.companies, request.auth.isAuthenticated && !request.headers['Only-Public'], selectedEvent))
  },
  description: 'Gets all the companies'
}

exports.remove = {
  auth: 'session',
  tags: ['api', 'company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the company we want to remove')
    }
  },
  pre: [
    { method: 'authorization.isAdmin(auth.credentials)' },
    { method: 'company.remove(params.id)', assign: 'company' },
    { method: 'notification.removeByThread(path, params.id)' },
    { method: 'comment.removeByThread(path, params.id)' },
    { method: 'communication.removeByThread(path, params.id)' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.company))
  },
  description: 'Removes an company'
}
