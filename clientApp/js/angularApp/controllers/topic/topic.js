'use strict';

theToolController.controller('TopicController', function ($rootScope, $scope, $routeParams, $location, $window, TopicFactory, NotificationFactory) {

  $rootScope.update.timeout(runController);

  function runController(){

    $scope.loading = true;

    TopicFactory.Topic.get({id: $routeParams.id}, function(result) {
      $scope.topic = result;

      console.log($location.search());
      if($location.search().editing == true) {
        $scope.topic.editing=true;
        console.log('TRUEEE');
      }

      $scope.topic.showComments = true;

      NotificationFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
        $scope.topic.notifications = getData;

        $scope.loading = false;
      });
    });
  }

});
