var fs = require("fs");

module.exports = {
  views: {
    path: "templates",
    engines: {
      html: "handlebars"
    },
    partialsPath: "partials"
  }/*,
  tls: {
    key:  fs.readFileSync("/root/rsa/key.pem"),
    cert: fs.readFileSync("/root/rsa/cert.pem")
  },
  cors: true*/
};
