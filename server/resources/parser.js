const server = require('../index').hapi

server.method('parser.members', parseMembers, {})

function parseMembers (text, thread, objectId, memberId, cb) {
  const memberPattern = /\B@[a-z0-9_-]+/gi

  let membersFound = text.match(memberPattern)
  for (let i in membersFound) {
    membersFound[i] = membersFound[i].replace('@', '').toLowerCase()
  }

  if (membersFound && membersFound.length > 0) {
    server.methods.notification.notifyMention(memberId, thread, membersFound, objectId, cb)
  } else {
    return cb()
  }
}
