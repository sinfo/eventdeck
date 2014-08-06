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
      if (!error && response.statusCode == 200) {
        member.facebookId = result.id;
        save(request.params.id, member);
      }
      else {
        reply({error: 'There was an error updating the member.'});
      }
    });
  }
  else {
    save(request.params.id, member);
  }

  function save(memberId, member) {
    Member.update({id: memberId}, member, function (err) {
      if (err) {
        reply({error: 'There was an error updating the member.'});
      }
      else {
        reply({success: 'Member updated.'});
      }
    });
  }
}
