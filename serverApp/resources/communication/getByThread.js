var Communication = require('./../../db/models/communication.js');

module.exports = list;

function list(request, reply) {

  console.log(request.params);

  if (request.path.indexOf('/api/company/') != -1) {
    request.params.thread = 'company-' + request.params.id;
  }
  else if (request.path.indexOf('/api/speaker/') != -1) {
    request.params.thread = 'speaker-' + request.params.id;
  }
  else {
    reply({error: "API path unknown."});
    return;
  }

  Communication.findByThread(request.params, function (err, result) {
    if (err) {
      reply({error: "Error getting communications from '" + request.params.thread + "'."});
    }
    else {
      reply(result);
    }
  });
}
