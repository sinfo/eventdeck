var server = require('../index').hapi
var log = require('../helpers/logger')
var Mailgun = require('mailgun-js')
var mgConfig = require('../../config').mailgun

var MailComposer = require('mailcomposer').MailComposer

var mg = Mailgun({apiKey: mgConfig.api, domain: mgConfig.domain})
var mailcomposer = new MailComposer()

server.method('email.send', send, {})

exports = module.exports = send

function send (message, cb) {
  log.debug({message: message, mg: mgConfig}, 'sending email')
  if (!message.html || message.html === '') {
    var data = {
      from: mgConfig.email,
      to: message.to,
      subject: message.subject,
      text: message.text
    }
    return mg.messages().send(data, cb)
  }

  mailcomposer.setMessageOption({
    from: mgConfig.email,
    to: message.to,
    cc: message.cc,
    subject: message.subject,
    replyTo: message.replyTo,
    body: message.text,
    html: message.html
  })

  mailcomposer.buildMessage(function (err, rawBody) {
    if (err) { return cb(err) }
    var dataToSend = {
      from: mgConfig.email,
      to: message.to,
      message: rawBody.toString('ascii')
    }
    mg.messages().sendMIME(dataToSend, cb)
  })
}
