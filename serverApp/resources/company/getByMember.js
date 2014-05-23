var Company = require('./../../db/models/company.js');

module.exports = list;

function list(request, reply) {

  Company.findByMember(request.params.id, function (err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "There was an error getting the companies of member '" + request.params.id + "'."});
    }
  });

}
