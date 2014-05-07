'use strict';

theToolController.controller('NotificationController', function ($scope, $http, $routeParams, $sce, $location, $rootScope, NotificationFactory, MemberFactory, CompanyFactory, SpeakerFactory) {

  $scope.loading = true;

  $scope.notifications = [];

  $scope.notificationsInfo = {
    number: 0,
    text: " Loading..."
  };

  $scope.me = {};
  $scope.members = [];
  $scope.companies = [];
  $scope.speakers = [];

  $scope.update = function() {
    NotificationFactory.getAll(function(response) {
      $scope.notifications = [];
      $scope.notificationsInfo.number = 0;

      for (var i = 0, j = response.length; i < j; i++) {
        //if (response[i].member != me.id) { //uncomment to hide self-events
        if (response[i].unread.indexOf($scope.me.id) != -1) {
          $scope.notificationsInfo.number++;

          $scope.notifications.unshift({
            path: response[i].thread.replace("-", "/"),
            text: response[i].description,
            member: $scope.members.filter(function(o) {
                      return response[i].member == o.id;
                    })[0].facebook,
            color: (response[i].unread.indexOf($scope.me.id) != -1 ? "LightSkyBlue" : "WhiteSmoke")
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
  }

  MemberFactory.Member.get({id: "me"}, function(me) {

    $scope.me = me;

    MemberFactory.Member.getAll(function(members) {

    $scope.members = members;

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
              color: (response[i].unread.indexOf(me.id) != -1 ? "LightSkyBlue" : "WhiteSmoke")
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

      setInterval($scope.update, 10000);

      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        setTimeout($scope.update, 500);
      });
    });
  });

  CompanyFactory.getAll(function(response) {
    $scope.predicate = 'participation.payment.price';
    $scope.reverse = true;
    $scope.companies = response;
  });

  SpeakerFactory.getAll(function(response) {
    $scope.predicate = 'participation';
    $scope.reverse = false;
    $scope.speakers = response;
  });

  $scope.display = false;

  $scope.show = function() {
    $scope.display = ($scope.search.name ? true : false);
  };

  $scope.hide = function() {
    $scope.display = false;
  };
});
