var Hapi  = require('hapi');
var Topic = require('./../../db/models/topic.js');

exports = module.exports = list;

function list(request, reply) {

  Topic.findByDuedate(request.params.start, request.params.end, function (err, result) {
    if (err) {
      reply(err);
    }
    else {
      reply(result);
    }
  });

}
