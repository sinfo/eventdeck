var Member = require("./../../db/models/member.js");

module.exports = login;

function login(request, reply) {
  if (request.auth.isAuthenticated) {
    reply().redirect("/");
  }
  else {
    reply.view("login.html");
  }
};