var Member  = require('../../db/models/member');
var Request = require('request');
var log = require('../../helpers/logger');

module.exports = update;

function update(request, reply) {
  
  var member = request.payload;

  if (member.facebook) {
    Request('http://graph.facebook.com/' + member.facebook, {
      method: 'GET',
      json: true
    },
    function (err, response, result) {
      if (err || response.statusCode != 200) {
        log.error({err: err || response.statusCode, username: request.auth.credentials.id, member: member}, '[member] error updating member (getting facebook id)');
        return reply({error: 'There was an error updating the member.'});
      }

      member.facebookId = result.id;
      save(member, reply);
    });
  }
  else {
    save(request.params.id, member);
  }

  function save(memberId, member) {

    Member.update({id: memberId}, member, function (err) {
      if (err) {
        log.error({err: err, username: request.auth.credentials.id, member: member}, '[member] error updating member');
        return reply({error: 'There was an error updating the member.'});
      }
      
      log.info({username: request.auth.credentials.id, member: member.id}, '[member] member updated');
      reply({success: 'Member updated.'});
    });
  }
}
