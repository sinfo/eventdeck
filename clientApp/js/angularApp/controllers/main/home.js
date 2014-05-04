'use strict';

theToolController.controller('home', function ($scope, $http, $sce, NotificationFactory) {
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.notifications = [];

  NotificationFactory.getAll(function(response) {
    for (var notification in response){
      $scope.notifications.unshift({
        path: response[notification].thread.replace("-", "/"),
        text: response[notification].description
      });
    }
  });
});
