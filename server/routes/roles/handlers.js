// var render = require('server/views/roles')

var roles = require('options').roles

exports = module.exports

exports.list = {
  auth: 'session',
  tags: ['api', 'roles'],
  handler: function (request, reply) {
    reply(roles)
  },
  description: 'Gets all the roles'
}
