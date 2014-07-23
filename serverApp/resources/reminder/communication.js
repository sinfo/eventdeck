var async         = require('async');
var Notification  = require('./../../db/models/notification');
var notify        = require('./../notification').notify;
var communication = require('./../communication');
var Speaker       = require('./../speaker');

module.exports = remind;

function remind(remindDays, done) {

  var daysToDueDate = [1,3,7,30];
  
  var today = new Date();
  var oneDay = (24 * 60 * 60 * 1000);
  
  communication.getThreads(function(threads){
    console.log(threads);
    async.each(threads, function(thread, threadDone) {
/*      var speaker = thread.split()[1];
      Speaker.get(speaker, function)*/
      communication.getByThreadLast(thread, function(result){
        if(today.getTime() - result.posted.getTime() > oneDay * remindDays){
          if(result.approved === undefined || result.approved){
            console.log(result);
            notify('toolbot', thread, 'reminder: communications have been innactive for more than ' + remindDays + ' days.', null, result.member);
          }
          else{
            notify('toolbot', thread, 'reminder: communication peding approval for more than ' + remindDays + ' days.', null, result.member);
          }
        }
        threadDone();
      });
    }, done);
  })
  
}
