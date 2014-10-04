var async         = require('async');
var Notification  = require('../../db/models/notification');
var notify        = require('../notification').notify;
var Communication = require('../communication');
var Event         = require('../event');
var Speaker       = require('../speaker');
var Member        = require('../member');
var log           = require('../../helpers/logger');

module.exports = remind;

function remind(remindDays, done) {

  var daysToDueDate = [1,3,7,30];
  
  var today = new Date();
  var oneDay = (24 * 60 * 60 * 1000);
  var week = new Date(today.getTime() - oneDay * 7);
  var coordination = [];
  var approvalTargets;

  Member.getByRole({params: {id: 'coordination'}}, function(result){
    if(result.error){
      done(result.error);
    }
    else{
      log.info('[reminder]', 'Communication reminders started!');
      async.each(result, function(member, memberDone){
        coordination.push(member.id);
        memberDone();
      }, function(){
        notifyThreads();
      });
    }
  });

  function notifyThreads(){

    Event.getLast(null, function(lastEvent){

      Communication.getThreads(function(threads){

        async.each(threads, function(thread, threadDone) {

          Notification.findByThreadAndDate(thread, week, function(err, notifications) {
            if(err) { return threadDone(err); }

            if(notifications.length === 0) {
              var speakerId = thread.split('speaker-')[1];
              var request = {params: {id: speakerId}, auth: {credentials: {id: 'toolbot'}}};
              var speakerStatus;

              if(!speakerId){
                return threadDone();
              }

              Speaker.get(request, function(speaker){
                if(speaker.error){
                  return threadDone(speaker.error);
                }

                speaker.participations.every(function(participation){
                  if(participation.event === lastEvent.id){
                    speakerStatus = participation.status;
                    return false;
                  }
                  return true;
                });

                if(speakerStatus !== 'Give Up' && speakerStatus !== 'Rejected') {

                  request.path = '/api/speaker/' + speakerId;

                  Communication.getByThreadLast(request, function(result){

                    if(today.getTime() - result.posted.getTime() > oneDay * remindDays){
                      if(result.status === undefined || result.status === 'approved'){
                        log.debug('[reminder]', thread);
                        notify('toolbot', thread, 'reminder: communications have been innactive for more than ' + remindDays + ' days.', null, [result.member]);
                      }
                      else{
                        approvalTargets = [result.member].concat(coordination);
                        notify('toolbot', thread, 'reminder: communication peding approval for more than ' + remindDays + ' days.', null, approvalTargets);
                      }
                    }
                    threadDone();
                  });
                }
                else{
                  log.debug('[reminder]', 'Speaker ' + speaker.id + ' status: ' + speaker.status + ' not reminded.');
                  threadDone(); 
                }
              });
            } else {
              log.debug('[reminder]', thread + ' already notified in the past week.');
              threadDone();
            }
          });
        }, done);
      });
    });


  }
}
