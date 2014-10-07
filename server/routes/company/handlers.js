var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

// TODO: SEND INITIAL EMAIL
// TODO: SPONSOR PAGE TRACKER
// TODO: EMAIL TRACKER

exports.create = {
  auth: 'session',
  tags: ['api','company'],
  validate: {
    payload: {
      id: Joi.string().description('id of the company'),
      name: Joi.string().required().description('name of the company'),
      description: Joi.string().description('description of the company'),
      img: Joi.string().description('image of the company'),
      url: Joi.string().description('url of the company'),
      contacts: Joi.string().description('contacts of the company'),
      history: Joi.string().description('history of the company'),
      area: Joi.string().description('area of the company'),
      participations: Joi.array().description('participations of the company'),
      accesses: Joi.string().description('accesses of the company'),
      updated: Joi.date().description('date the company was last updated'),
    }
  },
  pre: [
    { method: 'company.create(payload, auth.credentials.id)', assign: 'company' }
    // TODO: GET TARGETS
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.company).created('/api/company/'+request.pre.company.id);
  },
  description: 'Creates a new company'
};


exports.update = {
  auth: 'session',
  tags: ['api','company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the company we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the company'),
      name: Joi.string().description('name of the company'),
      description: Joi.string().description('description of the company'),
      img: Joi.string().description('image of the company'),
      url: Joi.string().description('url of the company'),
      contacts: Joi.string().description('contacts of the company'),
      history: Joi.string().description('history of the company'),
      area: Joi.string().description('area of the company'),
      participations: Joi.array().description('participations of the company'),
      accesses: Joi.string().description('accesses of the company'),
      updated: Joi.date().description('date the company was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'company.update(params.id, payload)', assign: 'company' }
    // TODO: GET TARGET
    // TODO: CREATE NOTIFICATION
    // TODO: EMAIL IF MEMBER NECESSARY FOR NEW MEMBER
  ],
  handler: function (request, reply) {
    reply(request.pre.company);
  },
  description: 'Updates an company'
};


exports.get = {
  auth: 'session',
  tags: ['api','company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the company we want to retrieve'),
    }
  },
  pre: [
    { method: 'company.get(params.id)', assign: 'company' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.company);
  },
  description: 'Gets an company'
};


exports.getByMember = {
  auth: 'session',
  tags: ['api','company'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the member'),
    }
  },
  pre: [
    { method: 'company.getByMember(params.id)', assign: 'companies' }
  ],
  handler: function (request, reply) {
    reply(request.pre.companies);
  },
  description: 'Gets companies of a given member'
};


exports.list = {
  auth: 'session',
  tags: ['api','company'],
  pre: [
    { method: 'company.list()', assign: 'companies' }
  ],
  handler: function (request, reply) {
    reply(request.pre.companies);
  },
  description: 'Gets all the companies'
};


exports.remove = {
  auth: 'session',
  tags: ['api','company'],
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the company we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
     // TODO: REMOVE COMMENTS
     // TODO: REMOVE COMMUNICATIONS
    }
  },
  pre: [
    { method: 'company.remove(params.id)', assign: 'company' }
  ],
  handler: function (request, reply) {
    reply(request.pre.company);
  },
  description: 'Removes an company'
};
