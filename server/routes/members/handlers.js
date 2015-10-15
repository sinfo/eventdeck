var Joi = require('joi');
var log = require('server/helpers/logger');
var render = require('server/views/member');


var handlers = module.exports;


exports.create = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    payload: {
      id: Joi.string().description('id of the member'),
      name: Joi.string().required().description('name of the member'),
      img: Joi.string().description('image of the member'),
      participations: Joi.array().includes(Joi.object().keys({
        role: Joi.string().description('the user role id'),
        event: Joi.string().description('the event id')
      })).description('participations of the member'),
      facebook: {
        id: Joi.string().description('facebook id of the member'),
        username: Joi.string().description('facebook username of the member'),
      },
      twitter: Joi.string().description('twitter handler of the member'),
      github: Joi.string().description('github username of the member'),
      skype: Joi.string().description('skype username of the member'),
      phones: Joi.array().description('phones of the member'),
      mails: {
        main: Joi.string().description('main email of the member (which is used for login and contacts)'),
        institutional: Joi.string().description('institutional email of the member'),
        dropbox: Joi.string().description('dropbox email of the member'),
        google: Joi.string().description('google email of the member'),
        microsoft: Joi.string().description('microsoft email of the member'),
      },
      loginCodes: Joi.array().description('login codes of the member'),
      subscriptions: Joi.array().description('subscriptions of the member'),
    }
  },
  pre: [
    { method: 'member.create(payload)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.member)).created('/api/members/'+request.pre.member.id);
  },
  description: 'Creates a new member'
};


exports.update = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the member we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the member'),
      name: Joi.string().description('name of the member'),
      img: Joi.string().description('image of the member'),
      participations: Joi.array().includes(Joi.object().keys({
        role: Joi.string().description('the user role id'),
        event: Joi.string().description('the event id')
      })).description('participations of the member'),
      facebook: {
        id: Joi.string().description('facebook id of the member'),
        username: Joi.string().description('facebook username of the member'),
      },
      twitter: Joi.string().description('twitter handler of the member'),
      github: Joi.string().description('github username of the member'),
      skype: Joi.string().description('skype username of the member'),
      phones: Joi.array().description('phones of the member'),
      mails: {
        main: Joi.string().description('main email of the member (which is used for login and contacts)'),
        institutional: Joi.string().description('institutional email of the member'),
        dropbox: Joi.string().description('dropbox email of the member'),
        google: Joi.string().description('google email of the member'),
        microsoft: Joi.string().description('microsoft email of the member'),
      },
      loginCodes: Joi.array().description('login codes of the member'),
      subscriptions: Joi.array().description('subscriptions of the member'),
      unreadAccess: Joi.date().description('last notificaiton count access')
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'member.update(params.id, payload)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.member));
  },
  description: 'Updates an member'
};

exports.updateMe = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    payload: {
      id: Joi.string().description('id of the member'),
      name: Joi.string().description('name of the member'),
      img: Joi.string().description('image of the member'),
      facebook: {
        id: Joi.string().description('facebook id of the member'),
        username: Joi.string().description('facebook username of the member'),
      },
      twitter: Joi.string().description('twitter handler of the member'),
      github: Joi.string().description('github username of the member'),
      skype: Joi.string().description('skype username of the member'),
      phones: Joi.array().description('phones of the member'),
      mails: {
        main: Joi.string().description('main email of the member (which is used for login and contacts)'),
        institutional: Joi.string().description('institutional email of the member'),
        dropbox: Joi.string().description('dropbox email of the member'),
        google: Joi.string().description('google email of the member'),
        microsoft: Joi.string().description('microsoft email of the member'),
      },
      subscriptions: Joi.array().description('subscriptions of the member'),
      unreadAccess: Joi.date().description('last notificaiton count access')
    }
  },
  pre: [
    { method: 'member.update(auth.credentials.id, payload)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.member));
  },
  description: 'Updates the connected user'
};


exports.get = {
  auth: 'session',
  tags: ['api','member'],
   validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
    },
    params: {
      id: Joi.string().required().description('id of the member we want to retrieve'),
    }
  },
  pre: [
    { method: 'member.get(params.id, query)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.member));
  },
  description: 'Gets an member'
};


exports.getMe = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
  }},
  pre: [
    { method: 'member.get(auth.credentials.id, query)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.member));
  },
  description: 'Gets the connected user'
};

exports.getSubscribers = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    },
    params: {
      id: Joi.string().required().description('id of the thread'),
    }
  },
  pre: [
    { method: 'member.getSubscribers(path, params.id,query)', assign: 'members' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.members));
  },
  description: 'Gets subscribers of a given thread'
};


exports.list = {
  auth: {
    strategies: ['session'],
    mode: 'try'
  },
  tags: ['api','member'],
  validate: {
    headers: Joi.object({
      'Only-Public': Joi.boolean().description('Set to true if you only want to receive the public list, even if you are authenticated')
    }).unknown(),
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
      event: Joi.string().description('Select members assigned to a specific event'),
      role: Joi.string().description('Select members assigned to a specific role'),
      participations: Joi.boolean().default(true).description('Based on role & event selects to query for those in or out of the group')
    }
  },
  pre: [
    { method: 'member.list(query)', assign: 'members' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.members, request.auth.isAuthenticated && !request.headers['Only-Public']));
  },
  description: 'Gets all the members'
};


exports.remove = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the member we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
     // TODO: REMOVE COMMENTS
     // TODO: REMOVE COMMUNICATIONS
    }
  },
  pre: [
    { method: 'member.remove(params.id)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.member));
  },
  description: 'Removes an member'
};
