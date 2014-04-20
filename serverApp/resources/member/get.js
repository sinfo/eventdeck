var Hapi           = require('hapi');
var async          = require('async');
var Member        = require('./../../db/models/member.js');

exports = module.exports = get;

/// get member

function get(request, reply) {

  var memberId = request.params.id;
  var member   = {};

  async.series([
      getMember,
    ], done);

  function getMember(cb) {
    Member.findById(memberId, gotMember);

    function gotMember(err, result) {
      if (err) {
        cb(err);
      }

      if (result.length > 0) {
        if (result[0].id)       { member.id       = result[0].id; }
        if (result[0].istId)    { member.istId    = result[0].istId; }
        if (result[0].name)     { member.name     = result[0].name; }
        if (result[0].role)     { member.role     = result[0].role; }
        if (result[0].facebook) { member.facebook = result[0].facebook; }
        if (result[0].skype)    { member.skype    = result[0].skype; }
        if (result[0].phones)   { member.phones   = result[0].phones; }
        if (result[0].mails)    { member.mails    = result[0].mails; }

        cb();
      }
      else {
        cb(Hapi.error.conflict('No bot with the ID: ' + botId));
      }
    }
  }

  function done(err) {
    if (err) {
      reply(Hapi.error.badRequest(err.detail));
    } else {
      reply(member);
    }
  }
}
