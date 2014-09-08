var Member = require('../../db/models/member');

module.exports = del;

function del(request, reply) {

  Member.remove({id: request.params.id}, function (err) {
    if (err) {
      return reply({error: 'There was an error deleting the member.'});
    }
    
    reply({success: 'Member deleted.'});
  });

}
