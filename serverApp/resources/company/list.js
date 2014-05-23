var Company = require('./../../db/models/company.js');

module.exports = list;

function list(request, reply) {

  Company.findAll(function (err, result) {
    if (!err && result && result.length > 0) {
      reply(result);
    }
    else {
      reply({error: "Error getting all companies."});
    }
  });

}
