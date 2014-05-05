'use strict';

theToolController.controller('NotificationController', function ($scope, $http, $routeParams, $sce, NotificationFactory, MemberFactory) {

  $scope.loading = true;

  $scope.notifications = [];

  $scope.notificationsInfo = {
    number: 0,
    text: " Loading..."
  };

  MemberFactory.Member.get({id: "me"}, function(me) {

    MemberFactory.Member.getAll(function(members) {

      NotificationFactory.getAll(function(response) {
        for (var i = 0, j = response.length; i < j; i++) {
          //if (response[i].member != me.id) { //uncomment to hide self-events
          if (response[i].unread.indexOf(me.id) != -1) {
            $scope.notificationsInfo.number++;

            $scope.notifications.unshift({
              path: response[i].thread.replace("-", "/"),
              text: response[i].description,
              member: members.filter(function(o) {
                        return response[i].member == o.id;
                      })[0].facebook,
              color: (response[i].unread.indexOf(me.id) != -1 ? "green" : "grey")
            });
          }
          //}
        }

        $scope.loading = false;

        if ($scope.notificationsInfo.number == 0) {
          $scope.notificationsInfo.text = " No Notifications";
        }
        else {
          $scope.notificationsInfo.text = " " + $scope.notificationsInfo.number + " Notification" + ($scope.notificationsInfo.number > 1 ? "s" : "");
        }
      });

      var update = function() {

        setTimeout(function() {

          NotificationFactory.getAll(function(response) {
            $scope.notifications = [];
            $scope.notificationsInfo.number = 0;
            
            for (var i = 0, j = response.length; i < j; i++) {
              //if (response[i].member != me.id) { //uncomment to hide self-events
              if (response[i].unread.indexOf(me.id) != -1) {
                $scope.notificationsInfo.number++;

                $scope.notifications.unshift({
                  path: response[i].thread.replace("-", "/"),
                  text: response[i].description,
                  member: members.filter(function(o) {
                            return response[i].member == o.id;
                          })[0].facebook,
                  color: (response[i].unread.indexOf(me.id) != -1 ? "green" : "grey")
                });
              }
              //}
            }

            $scope.loading = false;

            if ($scope.notificationsInfo.number == 0) {
              $scope.notificationsInfo.text = " No Notifications";
            }
            else {
              $scope.notificationsInfo.text = " " + $scope.notificationsInfo.number + " Notification" + ($scope.notificationsInfo.number > 1 ? "s" : "");
            }
          });

          update();
        }, 5000);

      };

      update();
    });
  });
});
