var async          = require('async');
var topicDudeDates = require('./topicDueDates');
var communication  = require('./communication');

module.exports = reminder;

function reminder(request, reply) {
  var result = {communication: {success: undefined, error: undefined}, duedates: {success: undefined, error: undefined}};
  async.parallel([
    function(cb){
      topicDudeDates(function(err) {
        if(err) { result.duedates.error = 'noooo'};
        result.duedates.success = 'yeap';
      });
    },
    function(cb){
      communication(7, function(err) {
        if(err) { result.communication.error = 'noooo'};
        result.communication.success = 'yeap';
      });
    }
  ], function(){
    reply(result);
  });
}
