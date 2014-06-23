var Member = require("./../../db/models/member.js");

module.exports = login;

function login(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply().redirect("/");
  }

  Member.find({id: request.params.id}, function (err, result) {
    if (!err && result && result.length > 0) {
      var member = result[0];

      var index = member.loginCodes.map(function (o) {
        return o.code;
      }).indexOf(request.params.code);

      if (index === -1 || member.loginCodes[index].created - Date.now() > 5*60*1000) {
        return reply({error: "Login failed."});
      }

      Member.update({id: request.params.id}, {loginCodes: []}, function (err) {
        if (err) {
          console.log(err);
          reply({error: "Login failed."});
        }
        else {
          request.auth.session.set(member);
          reply({success: "Logged in."});
        }
      });
    }
    else {
      reply({error: "Login failed."});
    }
  });
};
