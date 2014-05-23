var Company      = require('./../../db/models/company.js');
var notification = require('./../notification');

module.exports = get;

function get(request, reply) {

  Company.findById(request.params.id, function (err, result) {
    if (!err && result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Error getting company '" + request.params.id + "'."});
    }
  });

}
