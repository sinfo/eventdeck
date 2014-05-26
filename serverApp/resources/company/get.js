var Company      = require('./../../db/models/company.js');
var notification = require('./../notification');

module.exports = get;

function get(request, reply) {

  var companyId = request.params.id;

  Company.findById(companyId, function (err, result) {
    if (err) {
      reply({error: "Error getting company with id '" + companyId + "'."});
    }
    else if (result && result.length > 0) {
      reply(result[0]);
    }
    else {
      reply({error: "Could not find company with id '" + companyId + "'."});
    }

    notification.read(request.auth.credentials.id, 'company-' + companyId);
  });

}
