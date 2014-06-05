var async         = require("async");
var Comment       = require("./../../db/models/comment");
var Company       = require("./../../db/models/company");
var Communication = require("./../../db/models/communication");
var Notification  = require("./../../db/models/notification");

module.exports = del;

function del(request, reply) {

  var companyId = request.params.id;

  if (checkPermissions()) {
    Company.remove({id: companyId}, function (err) {
      if (err) {
        reply({error: "There was an error deleting the company."});
      }
      else {
        Comment.removeByThread("company-" + companyId, function (err) {
          // do nothing
        });

        Communication.removeByThread("company-" + companyId, function (err) {
          // do nothing
        });

        Notification.removeByThread("company-" + companyId, function (err) {
          // do nothing
        });

        reply({success: "Company deleted."});
      }
    });
  }
  else {
    reply({error: "You do not have permissions to delete a company."});
  }

  function checkPermissions() {
    return request.auth.credentials.roles.filter(function (o) {
      return o.id === "development-team" || o.id === "coordination";
    }).length > 0;
  }

}
