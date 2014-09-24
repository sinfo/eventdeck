var Communication = require('./../../db/models/communication.js');
var log = require('../../helpers/logger');

module.exports = list;

function list(reply) {

  Communication.getAllThreads(function(err, result) {
    if (err) {
      log.error({err: err}, '[communication] error getting all threads');
      return reply({error: 'There was an error getting all communications.'});
    }
    
    reply(result);
  });

}
