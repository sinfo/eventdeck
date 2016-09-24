var server = require('../index').hapi
var log = require('../helpers/logger')
var Mailgun = require('mailgun').Mailgun
var mgConfig = require('../../config').mailgun

var MailComposer = require('mailcomposer').MailComposer

var mg = new Mailgun(mgConfig.api)
var mailcomposer = new MailComposer()

server.method('email.send', send, {})

exports = module.exports = send

function send (message, cb) {
  log.debug({message: message, mg: mgConfig}, 'sending email')
  if (!message.html || message.html === '') {
    mg.sendText(mgConfig.email,
      message.to,
      message.subject,
      message.text,
      function (err) {
        if (err) { return cb('error on mailgun') }
        cb()
      }
    )
  } else {
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
      mg.sendRaw(mgConfig.email,
        message.to,
        rawBody,
        function (err) {
          if (err) { return cb(err) }
          cb()
        }
      )
    })
  }
}
