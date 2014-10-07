var Joi = require('joi');
var log = require('server/helpers/logger');


var handlers = module.exports;

exports.createCode = {
  auth: false,
  tags: ['api','auth'],
  validate: {
    params: {
      id: Joi.string().description('id of the member'),
    }
  },
  pre: [
    { method: 'auth.createCode(params.id)', assign: 'member' }
  ],
  handler: function (request, reply) {
    log.info('[auth] login code email sent'); 
    reply({success: 'email sent'});
  },
  description: 'Creates and sends a login code to the member'
};


exports.loginWithCode = {
  auth: false,
  tags: ['api','auth'],
  validate: {
    params: {
      id: Joi.string().description('id of the member'),
      code: Joi.string().description('login code of the member'),
    }
  },
  pre: [
    { method: 'auth.verifyCode(params.id, params.code)', assign: 'member' }
  ],
  handler: function (request, reply) {
    log.info({member: request.pre.member.id}, '[auth] logged in using code'); 
    request.auth.session.set(request.pre.member);
    reply({success: 'logged in'});
  },
  description: 'Let\'s a member log in using a code'
};


exports.logout = {
  auth: 'session',
  tags: ['api','auth'],
  handler: function (request, reply) {
    request.auth.session.clear();
    reply({success: 'your session is cleared'});
  },
  description: 'Let\'s a member log out'
};


