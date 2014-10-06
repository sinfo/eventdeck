var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

// TODO: SEND INITIAL EMAIL
// TODO: EMAIL TRACKER

exports.create = {
  auth: 'session',
  validate: {
    payload: {
      id: Joi.string().description('id of the speaker'),
      name: Joi.string().required().description('name of the speaker'),
      title: Joi.string().description('title of the speaker'),
      description: Joi.string().description('description of the speaker'),
      img: Joi.string().description('image of the speaker'),
      url: Joi.string().description('url of the speaker'),
      contacts: Joi.string().description('contacts of the speaker'),
      participations: Joi.array().description('participations of the speaker'),
      updated: Joi.date().description('date the speaker was last updated'),
    }
  },
  pre: [
    { method: 'speaker.create(payload, auth.credentials.id)', assign: 'speaker' }
    // TODO: GET TARGETS
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.speaker).created('/api/speaker/'+request.pre.speaker.id);
  },
  description: 'Creates a new speaker'
};


exports.update = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the speaker we want to update'),
    },
    payload: {
      id: Joi.string().description('id of the speaker'),
      name: Joi.string().required().description('name of the speaker'),
      title: Joi.string().description('title of the speaker'),
      description: Joi.string().description('description of the speaker'),
      img: Joi.string().description('image of the speaker'),
      url: Joi.string().description('url of the speaker'),
      contacts: Joi.string().description('contacts of the speaker'),
      participations: Joi.array().description('participations of the speaker'),
      updated: Joi.date().description('date the speaker was last updated'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'speaker.update(params.id, payload)', assign: 'speaker' }
    // TODO: GET TARGET
    // TODO: CREATE NOTIFICATION
    // TODO: EMAIL IF MEMBER NECESSARY FOR NEW MEMBER
  ],
  handler: function (request, reply) {
    reply(request.pre.speaker);
  },
  description: 'Updates an speaker'
};


exports.get = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the speaker we want to retrieve'),
    }
  },
  pre: [
    { method: 'speaker.get(params.id)', assign: 'speaker' }
    // TODO: READ NOTIFICATIONS
  ],
  handler: function (request, reply) {
    reply(request.pre.speaker);
  },
  description: 'Gets an speaker'
};


exports.getByMember = {
  auth: 'session',
  validate: {
    params: {
      id: Joi.string().required().description('id of the member'),
    }
  },
  pre: [
    { method: 'speaker.getByMember(params.id)', assign: 'speakers' }
  ],
  handler: function (request, reply) {
    reply(request.pre.speakers);
  },
  description: 'Gets speakers of a given member'
};


exports.list = {
  auth: 'session',
  pre: [
    { method: 'speaker.list()', assign: 'speakers' }
  ],
  handler: function (request, reply) {
    reply(request.pre.speakers);
  },
  description: 'Gets all the speakers'
};


exports.remove = {
  auth: 'session',
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the speaker we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
     // TODO: REMOVE COMMENTS
     // TODO: REMOVE COMMUNICATIONS
    }
  },
  pre: [
    { method: 'speaker.remove(params.id)', assign: 'speaker' }
  ],
  handler: function (request, reply) {
    reply(request.pre.speaker);
  },
  description: 'Removes an speaker'
};
