var server        = require("./../index.js").hapi;
var company       = require("./../resources/company");
var comment       = require("./../resources/comment");
var notification  = require("./../resources/notification");
var communication = require("./../resources/communication");
var session       = require("./../resources/session");
var member        = require("./../resources/member");

server.route({
  method: "GET",
  path: "/api/company",
  config: {
    handler: company.list,
    auth: true
  }
});

server.route({
  method: "POST",
  path: "/api/company",
  config: {
    handler: company.create,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/company/{id}",
  config: {
    handler: company.get,
    auth: true
  }
});

server.route({
  method: "PUT",
  path: "/api/company/{id}",
  config: {
    handler: company.update,
    auth: true
  }
});

server.route({
  method: "DELETE",
  path: "/api/company/{id}",
  config: {
    handler: company.delete,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/company/{id}/comments",
  config: {
    handler: comment.getByThread,
    auth: true
  }
});

server.route({
  method: "POST",
  path: "/api/company/{id}/sendInitialEmail",
  config: {
    handler: company.sendInitialEmail,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/company/{id}/notifications",
  config: {
    handler: notification.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/company/{id}/communications",
  config: {
    handler: communication.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/company/{id}/sessions",
  config: {
    handler: session.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/company/{id}/subscribe",
  config: {
    handler: member.getSubscription,
    auth: true
  }
});

server.route({
  method: "POST",
  path: "/api/company/{id}/subscribe",
  config: {
    handler: member.addSubscription,
    auth: true
  }
});

server.route({
  method: "DELETE",
  path: "/api/company/{id}/subscribe",
  config: {
    handler: member.removeSubscription,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/sponsor/{id}",
  config: {
    handler: company.sponsorPage,
    auth: {
      mode: "try"
    }
  }
});

server.route({
  method: "GET",
  path: "/sponsor/{id}/logo.jpg",
  config: {
    handler: company.imageTracker,
    auth: {
      mode: "try"
    }
  }
});