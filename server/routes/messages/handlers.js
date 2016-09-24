var Joi = require('joi')
var render = require('../../views/message')

exports = module.exports

exports.get = {
  auth: 'session',
  tags: ['api', 'message'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the message we want to retrieve')
    }
  },
  pre: [
    { method: 'message.get(params.id)', assign: 'message' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.message))
  },
  description: 'Gets an message'
}

exports.list = {
  auth: 'session',
  tags: ['api', 'message'],
  validate: {
    query: {
      fields: Joi.string().default('').description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array')
    }},
  pre: [
    { method: 'message.list(query)', assign: 'messages' }
  ],
  handler: function (request, reply) {
    reply(render(request.pre.messages))
  },
  description: 'Gets all the messages'
}
