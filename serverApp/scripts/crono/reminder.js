var CronJob  = require('cron').CronJob;
var Reminder = require('./../../resources/reminder');


module.exports = reminder = new CronJob({
  cronTime: '00 00 */6 * * *',
  onTick: function() {
    console.log('Running crono reminder.');
    Reminder(null, function(reply) {
      if(reply.success){
        console.log('Success while running crono reminder ' + reply.success);
      }
      else{
        console.log('Error while running crono reminder ' + reply.error);
      }
    });
  },
  start: false,
  timeZone: 'Portugal'
});