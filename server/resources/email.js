const server = require('../index').hapi
const log = require('../helpers/logger')
const Mailgun = require('mailgun').Mailgun
const mgConfig = require('../../config').mailgun

const MailComposer = require('mailcomposer').MailComposer

const mg = new Mailgun(mgConfig.api)
const mailcomposer = new MailComposer()

server.method('email.send', send, {})

exports = module.exports = send

function send (message, cb) {
  log.debug({message, mg: mgConfig}, 'sending email')
  if (!message.html || message.html === '') {
    mg.sendText(mgConfig.email,
      message.to,
      message.subject,
      message.text,
      (err) => {
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

    mailcomposer.buildMessage((err, rawBody) => {
      if (err) { return cb(err) }
      mg.sendRaw(mgConfig.email,
        message.to,
        rawBody,
        (err) => {
          if (err) { return cb(err) }
          cb()
        }
      )
    })
  }
}
