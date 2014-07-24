var async         = require('async');
var Notification  = require('./../../db/models/notification');
var notify        = require('./../notification').notify;
var communication = require('./../communication');
var Speaker       = require('./../speaker');
var Member        = require('./../member');

module.exports = remind;

function remind(remindDays, done) {

  var daysToDueDate = [1,3,7,30];
  
  var today = new Date();
  var oneDay = (24 * 60 * 60 * 1000);
  var coordination;
  var approvalTargets;

  Member.getByRole({params: {id: 'coordination'}}, function(result){
    if(result.error){
      console.log(result.error);
    }
    else{
      coordination = result;
      notifyThreads();
    }
  });

  function notifyThreads(){
    communication.getThreads(function(threads){
      async.each(threads, function(thread, threadDone) {
        var speakerId = thread.split('speaker-')[1];
        Speaker.get({params: {id: speakerId}, auth: {credentials: {id: 'toolbot'}}}, function(speaker){
          if(speaker.error){
            console.log(speaker.error);
            threadDone();
          }
          else if(speaker.status !== 'Give Up' && speaker.status !== 'Rejected') {
            communication.getByThreadLast(thread, function(result){
              if(today.getTime() - result.posted.getTime() > oneDay * remindDays){
                if(result.approved === undefined || result.approved){
                  console.log(thread);
                  notify('toolbot', thread, 'reminder: communications have been innactive for more than ' + remindDays + ' days.', null, result.member);
                }
                else{
                  approvalTargets = coordination.push(result.member);
                  notify('toolbot', thread, 'reminder: communication peding approval for more than ' + remindDays + ' days.', null, approvalTargets);
                }
              }
              threadDone();
            });
          }
          else{
            console.log('Speaker ' + speaker.id + ' status: ' + speaker.status + ' not reminded.') 
          }
        });
      }, done);
    })
  }
}
