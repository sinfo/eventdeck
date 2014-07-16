var Member = require("./../../db/models/member.js");

module.exports = remove;

function remove(request, reply) {

  var member = request.auth.credentials.id;

  reply("gaita");

}
