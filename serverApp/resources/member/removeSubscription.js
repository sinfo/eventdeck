var Member = require("./../../db/models/member.js");

module.exports = remove;

function remove(request, reply) {

  var memberId = request.auth.credentials.id;

  var source = request.url.path.split("/")[2];
  var sourceId = request.url.path.split("/")[3];

  Member.update({id: memberId}, {$pull: {"subscriptions.threads": source + "-" + sourceId}}, function (err) {
    if (err) {
      reply({error: "There was an error updating the member."});
    }
    else {
      reply({success: "Member updated."});
    }
  });

}
