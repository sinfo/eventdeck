var async        = require('async');
var Member       = require('./../../db/models/member.js');
var Company      = require('./../../db/models/company.js');
var Speaker      = require('./../../db/models/speaker.js');
var Notification = require('./../../db/models/notification.js');

exports = module.exports = notify;

function notify(memberId, thread, thingName, memberName, diffObject) {

  var editionsArray = [];
  for(var propertyName in diffObject) {
    if(propertyName != "updated"){
      editionsArray.push(propertyName);
    }  
  }
  var editions = editionsArray[0]; 
  if(editionsArray.length > 1){
    editions = editionsArray.slice(0, -1).join(', ')+ ' & ' +editionsArray[editionsArray.length -1];
  } 

  console.log(editionsArray);

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
  }

  function done(err) {
    if (err) {
      console.log("There was an error! "+ err);
    } else {
      console.log("Notification saved!");
    }
  }


}