var async        = require('async');
var Member       = require('./../../db/models/member.js');
var Company      = require('./../../db/models/company.js');
var Speaker      = require('./../../db/models/speaker.js');
var Notification = require('./../../db/models/notification.js');

exports = module.exports = notify;

function notify(memberId, thread, memberName) {

  var members = [];

  if(thread.indexOf('company-') != -1) {
    async.series([
      getMembers,
      getCompany
    ], done);
  } else if(thread.indexOf('speaker-') != -1) {
    async.series([
      getMembers,
      getSpeaker
    ], done);
  }

  function getMembers(cb) {
    Member.findAll(gotMembers);

    function gotMembers(err, result) {
      if (err) cb(err);
      for(var member in result) {
        if(result[member].id != memberId){
          members.push(result[member].id);
        }
      }
      cb();
    }
  }

  function getCompany(cb) {
    Company.findById(thread.split('company-')[1], gotCompany);

    function gotCompany(err, result) {
      if(err) { return cb(err); }
      if(result.length > 0) {
        var newNotification = new Notification({
          thread: thread,
          member: memberId,
          description: memberName+' posted a comment on '+result[0].name+'.',
          unread: members,
          posted: Date.now()
        })

        newNotification.save(function (err, reply){
          if (err) { return cb('Hipcup on the DB' + err);} 
          cb();
        });
      } else {
        cb('Company not found!');
      }
    }
  }

  function getSpeaker(cb) {
    Speaker.findById(thread.split('speaker-')[1], gotSpeaker);

    function gotSpeaker(err, result) {
      if(err) { return cb(err); }
      if(result.length > 0) {
        var newNotification = new Notification({
          thread: thread,
          member: memberId,
          description: memberName+' posted a comment on '+result[0].name+'.',
          unread: members,
          posted: Date.now()
        })

        newNotification.save(function (err, reply){
          if (err) { return cb('Hipcup on the DB' + err);} 
          cb();
        });
      } else {
        cb('Speaker not found!');
      }
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