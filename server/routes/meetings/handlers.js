var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.create = {
  auth: 'session',
  tags: ['api','meeting'],
  validate: {
    payload: {
      author: Joi.string().description('author of the meeting'),
      title: Joi.string().required().description('title of the meeting'),
      description: Joi.string().description('description of the meeting'),
      attendants: Joi.array().description('attendants of the meeting'),
      date: Joi.date().description('date of the meeting'),
    }
  },
  pre: [
    { method: 'meeting.create(payload, auth.credentials.id)', assign: 'meeting' }
    // TODO: CREATE NOTIFICATION
  ],
  handler: function (request, reply) {
    reply(request.pre.meeting).created('/meetings/'+request.pre.meeting.id);
  },
  description: 'Creates a new meeting'
};


exports.update = {
  auth: 'session',
  tags: ['api','meeting'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the meeting we want to update'),
    },
    payload: {
      author: Joi.string().description('author of the meeting'),
      title: Joi.string().description('title of the meeting'),
      description: Joi.string().description('description of the meeting'),
      attendants: Joi.array().description('attendants of the meeting'),
      date: Joi.date().description('date of the meeting'),
    }
  },
  pre: [
    // TODO: CHECK PERMISSIONS
    { method: 'meeting.update(params.id, payload)', assign: 'meeting' }
    // TODO: CREATE NOTIFICATION ?
  ],
  handler: function (request, reply) {
    reply(request.pre.meeting);
  },
  description: 'Updates a meeting'
};


exports.get = {
  auth: 'session',
  tags: ['api','meeting'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the meeting we want to retrieve'),
    }
  },
  pre: [
    { method: 'meeting.get(params.id)', assign: 'meeting' },
    // TODO: GET MEETING TOPICS
    { method: 'access.save(auth.credentials.id, path, params.id)' }
  ],
  handler: function (request, reply) {
    // TODO ADD TOPICS TO MEETING
    reply(request.pre.meeting);
  },
  description: 'Gets a meeting'
};


exports.list = {
  auth: 'session',
  tags: ['api','meeting'],
  pre: [
    { method: 'meeting.list()', assign: 'meetings' }
  ],
  handler: function (request, reply) {
    reply(request.pre.meetings);
  },
  description: 'Gets all the meetings'
};


exports.remove = {
  auth: 'session',
  tags: ['api','meeting'],
  validate: {
    params: {
     // TODO: CHECK PERMISSIONS
     id: Joi.string().required().description('id of the meeting we want to remove'),
     // TODO: REMOVE NOTIFICATIONS
    }
  },
  pre: [
    { method: 'meeting.remove(params.id)', assign: 'meeting' }
  ],
  handler: function (request, reply) {
    reply(request.pre.meeting);
  },
  description: 'Removes a meeting'
};
