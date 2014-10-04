var async          = require('async');
var topicDueDates = require('./topicDueDates');
var communication  = require('./communication');
var log = require('../../helpers/logger');

module.exports = reminder;

function reminder(request, reply) {
  var result = {communication: {success: undefined, error: undefined}, duedates: {success: undefined, error: undefined}};
  async.parallel([
    function(cb){
      topicDueDates(function(err) {
        if(err) { 
          result.duedates.error = 'noooo'; 
          return cb(err);
        }

        result.duedates.success = 'yeap';
        cb();
      });
    },
    function(cb){
      communication(7, function(err) {
        if(err) { 
          result.communication.error = 'noooo'; 
          return cb(err);
        }

        result.communication.success = 'yeap';
        cb();
      });
    }
  ], function(err){
    if(err) {
      return log.error({err: err}, '[reminder] error running reminder');
    }

    log.info('[reminder] reminder done');
    reply(result);
  });
}
