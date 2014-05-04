var async        = require('async');
var Member       = require('./../../db/models/member.js');
var Company      = require('./../../db/models/company.js');
var Speaker      = require('./../../db/models/speaker.js');
var Notification = require('./../../db/models/notification.js');

exports = module.exports = notify;

function notify(memberId, thread, thingName, memberName, diffObject) {

  var editionsArray = [];
  for(var propertyName in diffObject) {
    editionsArray.push(propertyName);
  }
  var editions = editionsArray.slice(0, -1).join(', ') + ' & ' + editionsArray[editionsArray.length];

  var members = [];
  async.series([
    getMembers,
    saveNotification
  ], done);

  function getMembers(cb) {
    Member.findAll(gotMembers);

    function gotMembers(err, result) {
      if (err) cb(err);
      for(var member in result) {
        members.push(result[member].id);
      }
      cb();
    }
  }

  function saveNotification(cb) {
    if(err) { return cb(err); }
    if(result.length > 0) {
      var newNotification = new Notification({
        thread: thread,
        member: memberId,
        description: memberName+' edited '+editions+' on '+thingName+'.',
        unread: members,
        posted: Date.now()
      })

      newNotification.save(function (err, reply){
        if (err) { return cb('Hipcup on the DB' + err);} 
        cb();
      });
    } else {
      cb('Thing not found!');
    }
  }

  function done(err) {
    if (err) {
      console.log("There was an error! "+ err);
    } else {
      console.log("Notification saved!");
    }
  }


}