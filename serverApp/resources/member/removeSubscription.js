var Member = require('./../../db/models/member.js');

module.exports = get;

function get(request, reply) {

  var member = request.auth.credentials.id;

  reply(request);

}
