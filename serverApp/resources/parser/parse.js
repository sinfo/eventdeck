var members = require('./members');

exports = module.exports = parse;

function parse(text, thread, objectId, memberId) {

  members(text, thread, objectId, memberId);

}