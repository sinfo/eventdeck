var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;


exports.create = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    payload: {
      id: Joi.string().description('id of the member'),
      name: Joi.string().required().description('name of the member'),
      img: Joi.string().description('image of the member'),
      roles: Joi.array().description('roles of the member'),
      facebook: {
        id: Joi.string().description('facebook id of the member'),
        username: Joi.string().description('facebook username of the member'),
      },
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
    reply(request.pre.member).created('/members/'+request.pre.member.id);
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
      roles: Joi.array().description('roles of the member'),
      facebook: {
        id: Joi.string().description('facebook id of the member'),
        username: Joi.string().description('facebook username of the member'),
      },
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
    // TODO: CHECK PERMISSIONS
    { method: 'member.update(params.id, payload)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(request.pre.member);
  },
  description: 'Updates an member'
};


exports.get = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('id,name,img,mails,facebook,phones').description('Fields we want to retrieve'),
    },
    params: {
      id: Joi.string().required().description('id of the member we want to retrieve'),
    }
  },
  pre: [
    { method: 'member.get(params.id, query)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(request.pre.member);
  },
  description: 'Gets an member'
};


exports.getMe = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('id,name,img').description('Fields we want to retrieve'),
    }
  },
  pre: [
    { method: 'member.get(auth.credentials.id, query.fields)', assign: 'member' }
  ],
  handler: function (request, reply) {
    reply(request.pre.member);
  },
  description: 'Gets an member'
};


exports.getByRole = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('id,name').description('Fields we want to retrieve'),
    },
    params: {
      id: Joi.string().required().description('id of the role'),
    }
  },
  pre: [
    { method: 'member.getByRole(params.id, query.fields)', assign: 'members' }
  ],
  handler: function (request, reply) {
    reply(request.pre.members);
  },
  description: 'Gets members of a given role'
};


exports.getTeamLeaders = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('id,name').description('Fields we want to retrieve'),
    },
  },  
  pre: [
    { method: 'member.getTeamLeaders(query.fields)', assign: 'members' }
  ],
  handler: function (request, reply) {
    reply(request.pre.members);
  },
  description: 'Gets members who are team leaders'
};


exports.getSubscribers = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('id,name').description('Fields we want to retrieve'),
    },
    params: {
      id: Joi.string().required().description('id of the thread'),
    }
  },
  pre: [
    { method: 'member.getSubscribers(path, params.id)', assign: 'members' }
  ],
  handler: function (request, reply) {
    reply(request.pre.members);
  },
  description: 'Gets subscribers of a given thread'
};


exports.list = {
  auth: 'session',
  tags: ['api','member'],
  validate: {
    query: {
      fields: Joi.string().default('id,name,img,facebook').description('Fields we want to retrieve'),
    }
  },
  pre: [
    { method: 'member.list(query.fields)', assign: 'members' }
  ],
  handler: function (request, reply) {
    reply(request.pre.members);
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
    reply(request.pre.member);
  },
  description: 'Removes an member'
};
