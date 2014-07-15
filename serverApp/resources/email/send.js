var Mailgun = require('mailgun').Mailgun;
var mgConfig = require('./../../../config').mailgun;
var mg = new Mailgun(mgConfig.api);

exports = module.exports = send;

function send(message, cb) {
  mg.sendText('tool@bananamarket.eu',
    message.to,
    message.subject,
    message.text,
    function(err) { 
      if(err) { return cb(err) }
      cb();
    });
}