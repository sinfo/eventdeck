'use strict';

theToolController.controller('home', function ($scope, $http, $sce, NotificationFactory, MemberFactory) {
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.timeSince =function (date) {
    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    console.log(date, seconds, interval);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  $scope.loading = true;
  $scope.notifications = [];

  MemberFactory.Member.get({id: "me"}, function(me) {

    MemberFactory.Member.getAll(function(members) {

      NotificationFactory.getAll(function(response) {
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
            member: members.filter(function(o) {
                      return response[i].member == o.id;
                    })[0].facebook,
            color: (response[i].unread.indexOf(me.id) != -1 ? "green" : "grey")
          });
          //}
        }

        $scope.loading = false;
      });
    });
  });
});