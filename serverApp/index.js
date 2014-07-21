var Hapi         = require("hapi");
var SocketIO     = require("socket.io");
var options      = require("./options");
var cookieConfig = require("./../config").cookie;
require("./db");

var server = module.exports.hapi = new Hapi.Server(8765, options);

server.pack.require("hapi-auth-cookie", function (err) {

  server.auth.strategy("session", "cookie", {
    cookie: cookieConfig.name,
    password: cookieConfig.password,
    ttl: 2592000000,
    isSecure: false
  });

  var routes = require("./routes");

  server.start(function () {
    console.log("Server started at: " + server.info.uri);
    var webSocket = module.exports.webSocket = {
      server: SocketIO.listen(server.listener)
    };
    var sockets = require("./sockets");
    require("./scripts/crono");
  });

});
