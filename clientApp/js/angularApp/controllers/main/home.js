"use strict";

theToolController.controller("home", function ($scope, NotificationFactory) {

  $scope.loading = true;
  $scope.notifications = [];
  $scope.limit = 10;

  NotificationFactory.Notification.getAll(function (response) {
    $scope.notifications = response;
    $scope.loading = false;
  });

  $scope.scroll = function () {
    if ($scope.limit < $scope.notifications.length) {
      $scope.limit += 10;
    }
  };

});
