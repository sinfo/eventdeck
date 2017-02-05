const Boom = require('boom')
const server = require('../index').hapi
const log = require('../helpers/logger')
const urlPrefix = require('../../config').url
const Request = require('request')
const facebookConfig = require('../../config').facebook

server.method('auth.createCode', createCode, {})
server.method('auth.verifyCode', verifyCode, {})
server.method('auth.verifyFacebook', verifyFacebook, {})

function createCode (memberId, cb) {
  server.methods.member.createLoginCode(memberId, (err, result) => {
    if (err) {
      log.error({err: err, member: memberId}, 'error creating code')
      return cb(err)
    }

    const member = result.member
    const loginCode = result.loginCode

    log.info({member: memberId, loginCode}, 'login code created')

    const message = {
      to: member.name + '<' + member.mails.main + '>',
      subject: '[SINFO] Login code for Deck!',
      text: 'Hey ' + member.name + '!\n\n Here is your code for logging in on EventDeck: ' + loginCode + '\n\n' + urlPrefix + '/login/' + member.id + '/' + loginCode
    }

    server.methods.email.send(message, function (err) {
      if (err) {
        log.warn(err)
        log.error({err, member: memberId}, 'error sending code')
        return cb(Boom.internal('error sending email'))
      }
      cb(null, member)
    })
  })
}

function verifyCode (memberId, loginCode, cb) {
  server.methods.member.get(memberId, '', (err, member) => {
    if (err) {
      log.error({err, member: memberId}, 'error finding member')
      return cb(err)
    }

    const index = member.loginCodes.map((o) => {
      return o.code
    }).indexOf(loginCode)

    if (index === -1 || member.loginCodes[index].created - new Date() > 5 * 60 * 1000) {
      log.warn({
        member: memberId,
        loginCode: loginCode,
        loginCodes: member.loginCodes
      }, '[auth] member tried to login with an invalid code')
      return cb(Boom.unauthorized())
    }
    cb(null, member)
  })
}

function verifyFacebook (facebookUserId, facebookUserToken, cb) {
  Request.get('https://graph.facebook.com/debug_token?input_token=' + facebookUserToken + '&access_token=' + facebookConfig.appId + '|' + facebookConfig.appSecret, {
    json: true
  }, (error, response, result) => {
    if (error || response.statusCode !== 200) {
      log.error({err: error, member: facebookUserToken}, 'error logging in with facebook')
      return cb(Boom.unauthorized(error))
    }

    if (!result.data || result.data.app_id !== facebookConfig.appId || result.data.user_id !== facebookUserId) {
      log.error({
        'result-app-id': result.data.app_id,
        'config-app-id': facebookConfig.appId,
        'result-user-id': result.data.user_id,
        'requested-user-id': facebookUserId
      }, 'error logging in with facebook')

      return cb(Boom.unauthorized())
    }

    server.methods.member.get(facebookUserId, '', (err, member) => {
      if (err) {
        log.error({err, facebookUserId}, 'error finding member')
        return cb(err)
      }

      cb(null, member)
    })
  })
}
