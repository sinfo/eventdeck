'use strict';

theToolController.controller('NotificationController', function ($scope, $http, $routeParams, $sce, NotificationFactory, MemberFactory) {

  $scope.notifications = {
    number: 0,
    text: " Loading..."
  };

  MemberFactory.Member.get({id: "me"}, function(me){

    NotificationFactory.getAll(function(response){
      for (var notification in response){
        if (response[notification].thread/* && response[notification].member != me.id*/){ //uncomment to hide self-events
          if (response[notification].unread.indexOf(me.id) != -1){
            $scope.notifications.number++;
          }
        }
      }

      if ($scope.notifications.number == 0){
        $scope.notifications.text = " No notifications";
      }
      else{
        $scope.notifications.text = " " + $scope.notifications.number + " notification" + ($scope.notifications.number > 1 ? "s" : "");
      }
    });
  });
});
