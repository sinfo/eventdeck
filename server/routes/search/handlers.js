var Joi = require('joi');
var log = require('server/helpers/logger');
var companiesRender = require('server/views/company');
var speakersRender = require('server/views/speaker');
var membersRender = require('server/views/member');
var topicsRender = require('server/views/topic');


var handlers = module.exports;

exports.search = {
  auth: 'session',
  tags: ['api','search'],
  validate: {
    params: {
      str: Joi.string().required().description('String you\'re looking for'),
    },
    query: {
      fields: Joi.string().description('Fields we want to retrieve'),
      skip: Joi.number().integer().min(0).default(0).description('Number of documents to skip'),
      limit: Joi.number().integer().min(1).description('Max number of documents to retrieve'),
      sort: Joi.string().description('How to sort the array'),
    }
  },
  pre: [
    { method: 'company.search(params.str, query)', assign: 'companies' },
    { method: 'speaker.search(params.str, query)', assign: 'speakers' },
    { method: 'member.search(params.str, query)', assign: 'members' },
    { method: 'topic.search(params.str, query)', assign: 'topics' },
  ],
  handler: function (request, reply) {
    reply({
      companies: request.pre.companies && {
        exact: request.pre.companies.exact && companiesRender(request.pre.companies.exact),
        extended: request.pre.companies.extended && companiesRender(request.pre.companies.extended)
      },
      speakers: request.pre.speakers && {
        exact: request.pre.speakers.exact && speakersRender(request.pre.speakers.exact),
        extended: request.pre.speakers.extended && speakersRender(request.pre.speakers.extended)
      },
      topics: request.pre.topics && {
        exact: request.pre.topics.exact && topicsRender(request.pre.topics.exact),
        extended: request.pre.topics.extended && topicsRender(request.pre.topics.extended)
      },
      members: request.pre.members && {
        exact: request.pre.members.exact && membersRender(request.pre.members.exact),
        extended: request.pre.members.extended && membersRender(request.pre.members.extended)
      },
    });
  },
  description: 'Lets you search for stuff'
};