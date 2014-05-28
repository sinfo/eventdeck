'use strict';

theToolController.controller('TopicController', function ($scope, $routeParams, $location, $window, TopicFactory, NotificationFactory) {

  $scope.loading = true;

  TopicFactory.Topic.get({id: $routeParams.id}, function(result) {
    $scope.topic = result;

    $scope.topic.showComments = true;

    NotificationFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
      $scope.topic.notifications = getData;

      $scope.loading = false;
    });
  });

});
