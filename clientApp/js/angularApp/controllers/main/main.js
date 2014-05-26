'use strict';

theToolController.controller('MainController', function ($scope, $http, $routeParams, $sce, $location, $rootScope, NotificationFactory, MemberFactory, CompanyFactory, SpeakerFactory, TopicFactory) {

  $scope.timeSince =function (date) {
    date = new Date(date);
    var seconds = Math.floor((Date.now() - date) / 1000);

    var suffix = 'ago';
    if(seconds < 0){
      seconds = Math.abs(seconds);
      suffix = 'to go';
    }

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years " + suffix;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months " + suffix;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days " + suffix;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours " + suffix;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes " + suffix;
    }
    return Math.floor(seconds) + " seconds " + suffix;
  };

  $scope.getMemberFacebook = function(id) {
    return $scope.members.filter(function(e){
        return e.id == id;
      })[0].facebook;
  }

  $scope.getName = function (member) {
    return $scope.members.filter(function(o) {
      return o.id == member;
    })[0].name;
  };

  $scope.getFacebook = function (member) {
    return $scope.members.filter(function(o) {
      return o.id == member;
    })[0].facebook;
  };


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

  $scope.search = {};

  $scope.update = function() {
    NotificationFactory.Notification.getAll(function(response) {
      $scope.notifications = [];
      $scope.notificationsInfo.number = 0;

      for (var i = 0, j = response.length; i < j; i++) {
        //if (response[i].member != me.id) { //uncomment to hide self-events
        if (response[i].unread.indexOf($scope.me.id) != -1) {
          $scope.notificationsInfo.number++;

          $scope.notifications.unshift({
            path: response[i].thread.replace("-", "/"),
            text: response[i].description + " (" + $scope.timeSince(new Date(response[i].posted))+")",
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

      NotificationFactory.Notification.getAll(function(response) {
        for (var i = 0, j = response.length; i < j; i++) {
          //if (response[i].member != me.id) { //uncomment to hide self-events
          if (response[i].unread.indexOf(me.id) != -1) {
            $scope.notificationsInfo.number++;

            $scope.notifications.unshift({
              path: response[i].thread.replace("-", "/"),
              text: response[i].description + " (" + $scope.timeSince(new Date(response[i].posted))+")",
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
        $scope.search.name = '';
      });
    });
  });

  CompanyFactory.Company.getAll(function(response) {
    $scope.predicate = 'participation.payment.price';
    $scope.reverse = true;
    $scope.companies = response;
  });

  SpeakerFactory.Speaker.getAll(function(response) {
    $scope.predicate = 'participation';
    $scope.reverse = false;
    $scope.speakers = response;
  });

  TopicFactory.Topic.getAll(function(response) {
    $scope.topics = response;
  });

  $scope.display = false;

  $scope.show = function() {
    $scope.display = ($scope.search.name ? true : false);
  };

  $scope.hide = function() {
    $scope.display = false;
  };
});
