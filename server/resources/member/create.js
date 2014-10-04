var Member  = require('../../db/models/member');
var Request = require('request');
var log = require('../../helpers/logger');

module.exports = create;

function create(request, reply) {

  var member = request.payload;

  if (!member.id) {
    return reply({error: 'No id specified.'});
  }

  if (member.facebook) {
    Request('http://graph.facebook.com/' + member.facebook, {
      method: 'GET',
      json: true
    },
    function (err, response, result) {
      if (err || response.statusCode != 200) {
        log.error({err: err || response.statusCode, username: request.auth.credentials.id, member: member}, '[member] error creating new member (getting facebook id)');
        return reply({error: 'There was an error creating the member.'});
      }

      member.facebookId = result.id;
      save(member, reply);
    });
  }
  else {
    save(member);
  }

  function save(member) {
    member = new Member(member);

    member.save(function (err) {
      if (err) {
        log.error({err: err, username: request.auth.credentials.id, member: member}, '[member] error creating new member');
        return reply({error: 'There was an error creating the member.'});
      }
      
      log.info({username: request.auth.credentials.id, member: member.id}, '[member] new member created');
      reply({success: 'Member created.', id: member.id});
    });
  }
}