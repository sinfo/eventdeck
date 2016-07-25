var CronJob = require('cron').CronJob
var reminder = require('./../../resources/reminder')

module.exports = new CronJob({
  cronTime: '00 00 */6 * * *',
  onTick: function () {
    console.log('Running crono reminder.')
    reminder(null, function (reply) {
      if (reply.success) {
        console.log('Success while running crono reminder ' + reply.success)
      }else {
        console.log('Error while running crono reminder ' + reply.error)
      }
    })
  },
  start: false,
  timeZone: 'Portugal'
})
