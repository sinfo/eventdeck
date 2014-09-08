var async = require('async');
var Topic = require('./../../db/models/topic');
var Notification = require('./../../db/models/notification');
var notify = require('./../notification').notify;
var getTargets   = require('./../member').getTargetsByThread;


module.exports = remind;

function remind(done) {

  var daysToDueDate = [1,3,7,30];
  
  var today = new Date();
  var oneDay = (24 * 60 * 60 * 1000);
  var tomorrow = new Date(today.getTime() + oneDay);
  var yesterday = new Date(today.getTime() - oneDay);

  async.each(daysToDueDate, function(days, daysDone) {
    Topic.findByDuedate(new Date(yesterday.getTime() + oneDay*days), new Date(tomorrow.getTime() + oneDay*days), function (err, topics) {
      if (err) { return daysDone(err); }

      async.each(topics, function(topic, topicDone) {
        if(err) { return topicDone(err); }
        
        Notification.findByThreadAndDate('topic-'+topic._id, yesterday, function(err, notifications) {
          if(err) { return topicDone(err); }
          
          if(notifications.length === 0) {
            getTargets('topic-'+topic._id, function(err, targets) {
              if(err) { topicDone(err); }

              notify('toolbot', 'topic-'+topic._id, 'reminder: only ' + days + ' days to go.', null, targets);

              topicDone();
            });
          } else {
            topicDone();
          }
        });
      }, daysDone);
    });
  }, done);
}
