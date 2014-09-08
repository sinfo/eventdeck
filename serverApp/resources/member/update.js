var Member  = require('./../../db/models/member.js');
var Request = require('request');

module.exports = update;

function update(request, reply) {
  
  var member = request.payload;

  if (member.facebook) {
    Request('http://graph.facebook.com/' + member.facebook, {
      method: 'GET',
      json: true
    },
    function (error, response, result) {
      if (error || response.statusCode != 200) {
        return reply({error: 'There was an error creating the member.'});
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
        console.log(err);
        return reply({error: 'There was an error updating the member.'});
      }
      
      reply({success: 'Member updated.'});
    });
  }
}
