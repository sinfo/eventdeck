"use strict";

theToolServices
  .factory("TopicFactory", function ($resource) {
    return {
      Topic: $resource("/api/topic/:id", null, {
        "getAll": {method: "GET", isArray: true},
        "create": {method: "POST"},
        "update": {method: "PUT"},
        "delete": {method: "DELETE"}
      }),
      Member: $resource("/api/member/:id/topics", null, {
        "getAll": { method: "GET", isArray: true }
      })
    };
  })
