var Notification = require('../../db/models/notification');
var log = require('../../helpers/logger');

exports = module.exports = read;

function read(memberId, thread) {
  Notification.readThread(memberId, thread, function(err){
    if (err) {
      log.error({err: err, member: memberId, thread: thread}, '[notification] error reading thread');
    }
  });
}
