var Joi = require('joi')
var log = require('server/helpers/logger')

var handlers = module.exports

handlers.company = {
  auth: false,
  tags: ['api', 'templates'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the company we want')
    }
  },
  pre: [
    {
      method: function (request, reply) {
        request.server.methods.company.get(request.params.id, {}, function (err, company) {
          return reply(err || company)
        })
      },
      assign: 'company'
    }
  ],
  handler: function (request, reply) {
    reply.view('companyPT.hbs', {
      company: request.pre.company
    })
  },
  description: 'Renders a company email template'
}

handlers.startup = {
  auth: false,
  tags: ['api', 'templates'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the company we want')
    }
  },
  pre: [
    {
      method: function (request, reply) {
        request.server.methods.company.get(request.params.id, {}, function (err, company) {
          return reply(err || company)
        })
      },
      assign: 'company'
    }
  ],
  handler: function (request, reply) {
    reply.view('startupPT.hbs', {
      company: request.pre.company
    })
  },
  description: 'Renders a startup email template'
}

handlers.speaker = {
  auth: false,
  tags: ['api', 'templates'],
  validate: {
    params: {
      id: Joi.string().required().description('id of the speaker we want')
    }
  },
  pre: [
    {
      method: function (request, reply) {
        request.server.methods.speaker.get(request.params.id, {}, function (err, speaker) {
          return reply(err || speaker)
        })
      },
      assign: 'speaker'
    }
  ],
  handler: function (request, reply) {
    reply.view('speakerEN.hbs', {
      speaker: request.pre.speaker
    })
  },
  description: 'Renders a speaker email template'
}
