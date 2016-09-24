var server = require('../index').hapi

server.method('parser.members', parseMembers, {})

function parseMembers (text, thread, objectId, memberId, cb) {
  var memberPattern = /\B@[a-z0-9\._-]+/gi

  var membersFound = text.match(memberPattern)
  for (var i in membersFound) {
    membersFound[i] = membersFound[i].replace('@', '').toLowerCase()
  }

  if (membersFound && membersFound.length > 0) {
    server.methods.notification.notifyMention(memberId, thread, membersFound, objectId, cb)
  } else {
    return cb()
  }
}
