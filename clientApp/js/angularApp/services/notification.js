"use strict";

theToolServices.factory("NotificationFactory", function ($resource) {
  return {
    Notification: $resource("/api/notification/:id", null, {
      "getAll": {method: "GET", isArray: true},
      "update": {method: "PUT"}
    }),
    Company: $resource("/api/company/:id/notifications", null, {
      "getAll": {method: "GET", isArray: true}
    }),
    Speaker: $resource("/api/speaker/:id/notifications", null, {
      "getAll": {method: "GET", isArray: true}
    }),
    Topic: $resource("/api/topic/:id/notifications", null, {
      "getAll": {method: "GET", isArray: true}
    })
  };
});
