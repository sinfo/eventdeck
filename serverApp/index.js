var Hapi         = require("hapi");
var SocketIO     = {server: require("socket.io"), client: require('socket.io-client')};
var options      = require("./options");
var cookieConfig = require("./cookieConfig");
require("./db");

var server = module.exports.hapi = new Hapi.Server(8765, options);

server.pack.require("hapi-auth-cookie", function (err) {

  server.auth.strategy("session", "cookie", {
    cookie: cookieConfig.name,
    password: cookieConfig.password,
    ttl: 2592000000,
    isSecure: false,
    redirectTo: "/login"
  });

  server.start(function () {
    console.log("Server started at: " + server.info.uri);
    console.log(server);
    var webSocket = module.exports.webSocket = {
      server: SocketIO.server.listen(server.listener)
    };
    var sockets = require("./sockets");
    webSocket.client = module.exports.webSocket.client = SocketIO.client.connect("http://localhost:" + server.info.port + "/chat");
    var routes = require("./routes");
  });

});
