var fs = require("fs");

module.exports = {
  views: {
    path: "templates",
    engines: {
      html: "handlebars"
    },
    partialsPath: "partials"
  }
};
