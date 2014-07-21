var async         = require('async');
var Notification  = require('./../../db/models/notification');
var notify        = require('./../notification').notify;
var communication = require('./../communication');

module.exports = remind;

function remind(remindDays, done) {

  var daysToDueDate = [1,3,7,30];
  
  var today = new Date();
  var oneDay = (24 * 60 * 60 * 1000);
  
  communication.getThreads(function(threads){
    console.log(threads);
    async.each(threads, function(thread, threadDone) {
      communication.getByThreadLast(thread, function(result){
        console.log(result);
        if(today.getTime() - result.posted.getTime() > oneDay * remindDays){
          if(result.approved === undefined || result.approved){
            notify('toolbot', thread, 'reminder: communications have been innactive for more than ' + remindDays + ' days.', null, result.member);
          }
        }
        threadDone();
      });
    }, done);
  })
  
}
