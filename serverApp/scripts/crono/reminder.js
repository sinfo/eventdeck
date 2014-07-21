var CronJob  = require('cron').CronJob;
var Reminder = require('./../../resources/reminder');


module.exports = reminder = new CronJob({
  cronTime: '00 00 17 * * *',
  onTick: function() {
  	var reply;
    console.log("Running crono reminder.");
    Reminder(null, reply);
    if(reply.success){
    	console.log("Success while running crono reminder " + reply.success);
    }
    else{
    	console.log("Error while running crono reminder " + reply.error);
    }
  },
  start: true,
  timeZone: "Portugal"
});