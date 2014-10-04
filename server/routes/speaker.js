var server        = require("./../index.js").hapi;
var speaker       = require("./../resources/speaker");
var comment       = require("./../resources/comment");
var notification  = require("./../resources/notification");
var communication = require("./../resources/communication");
var session       = require("./../resources/session");
var subscription  = require("./../resources/subscription");

server.route({
  method: "GET",
  path: "/api/speaker",
  config: {
    handler: speaker.list,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}",
  config: {
    handler: speaker.get,
    auth: true
  }
});

server.route({
  method: "POST",
  path: "/api/speaker",
  config: {
    handler: speaker.create,
    auth: true
  }
});

server.route({
  method: "PUT",
  path: "/api/speaker/{id}",
  config: {
    handler: speaker.update,
    auth: true
  }
});

server.route({
  method: "DELETE",
  path: "/api/speaker/{id}",
  config: {
    handler: speaker.delete,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}/comments",
  config: {
    handler: comment.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}/sendInitialEmail",
  config: {
    handler: speaker.sendInitialEmail,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}/notifications",
  config: {
    handler: notification.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}/communications",
  config: {
    handler: communication.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}/sessions",
  config: {
    handler: session.getByThread,
    auth: true
  }
});

server.route({
  method: "GET",
  path: "/api/speaker/{id}/subscription",
  config: {
    handler: subscription.get,
    auth: true
  }
});

server.route({
  method: "POST",
  path: "/api/speaker/{id}/subscription",
  config: {
    handler: subscription.add,
    auth: true
  }
});

server.route({
  method: "DELETE",
  path: "/api/speaker/{id}/subscription",
  config: {
    handler: subscription.remove,
    auth: true
  }
});
