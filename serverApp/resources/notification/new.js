var async        = require('async');
var Member       = require('./../../db/models/member.js');
var Company      = require('./../../db/models/company.js');
var Speaker      = require('./../../db/models/speaker.js');
var Notification = require('./../../db/models/notification.js');

exports = module.exports = notify;

function notify(memberId, thread, thingName, thingType, memberName) {

  var members = [];
  async.series([
    getMembers,
    saveNotification
  ], done);

  function getMembers(cb) {
    Member.findAll(gotMembers);

    function gotMembers(err, result) {
      if (err)
        return cb(err);

      for(var member in result) {
        if(result[member].id != memberId){
          members.push(result[member].id);
        }
      }
      cb();
    }
  }

  function saveNotification(cb) {
    var description = memberName+' created a new ' +thingType;
    if(thingName) {
      description += ' named ' +thingName+'.';
    }
    var newNotification = new Notification({
      thread: thread,
      member: memberId,
      description: description,
      unread: members,
      posted: Date.now()
    });

    newNotification.save(function (err, reply){
      if (err) {
        cb('Hipcup on the DB' + err);
      }
      else {
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      console.log("There was an error! "+ err);
    } else {
      console.log("Notification saved!");
    }
  }


}
