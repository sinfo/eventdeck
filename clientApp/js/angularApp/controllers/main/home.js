'use strict';

theToolController.controller('home', function ($scope, $http, $sce,  $rootScope, NotificationFactory, MemberFactory) {

  $scope.loading = true;
  $scope.notifications = [];
  $scope.limit = 10;

  init();

  function init() {
    setTimeout(function() {
      if ($scope.loading)
        init();
    }, 1000);

    NotificationFactory.Notification.getAll(function(response) {
      $scope.notifications = response;
      $scope.loading = false;
    });
  }

  $scope.scroll = function() {
    if ($scope.limit < $scope.notifications.length)
      $scope.limit += 10;
  };

});
