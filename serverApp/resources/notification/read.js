var Notification = require('./../../db/models/notification.js');

exports = module.exports = read;

function read(memberId, thread) {
  Notification.readThread(memberId, thread, function(err){
    if (err)
      console.log(err);
    else
      console.log("Great success!");
  });
}
