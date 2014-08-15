var notification = require('./../notification');

exports = module.exports = parse;

function parse(text, thread, objectId, memberId) {

  var memberPattern = /\B@[a-z0-9\._-]+/gi;
  var membersFound = text.match(memberPattern);
  for(var i in membersFound) {
    membersFound[i] = membersFound[i].replace('@','');
  }

  if(membersFound.length > 0) {
    notification.notify(memberId, thread, 'mentioned you', objectId, membersFound);
  }
}