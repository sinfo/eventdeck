'use strict';

theToolController.controller('home', function ($scope, $http, $sce,  $rootScope, NotificationFactory, MemberFactory) {

  $scope.getImageFromThread =function (thread) {
    if(thread.indexOf('company-') != -1) {
      return  $scope.companies.filter(function(o) {
                return thread.split('company-')[1] == o.id;
              })[0].img;
    }
    else if(thread.indexOf('speaker-') != -1) {
      return $scope.speakers.filter(function(o) {
                return thread.split('speaker-')[1] == o.id;
              })[0].img;
    }
  }

  $scope.loading = true;
  $scope.notifications = [];

  MemberFactory.Member.get({id: "me"}, function(me) {
    $scope.me = me;

    MemberFactory.Member.getAll(function(members) {

      NotificationFactory.Notification.getAll(function(response) {
        for (var i = 0, j = response.length; i < j; i++) {
          //if (response[i].member != me.id){ //uncomment to hide self-events
          var date = new Date(response[i].posted);
          $scope.notifications.unshift({
            path: response[i].thread.replace("-", "/"),
            date: {
              data: date,
              full: date.toString()
            },
            description: response[i].description,
            thread: response[i].thread,
            member: {
              id: response[i].member,
              name: members.filter(function(o) {
                      return response[i].member == o.id;
                    })[0].name,
              facebook: members.filter(function(o) {
                      return response[i].member == o.id;
                    })[0].facebook
            },
            color: (response[i].unread.indexOf(me.id) != -1 ? "unread" : "read")
          });
          //}
        }

        $scope.loading = false;
      });
    });
  });
});
