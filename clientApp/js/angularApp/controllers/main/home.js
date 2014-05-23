'use strict';

theToolController.controller('home', function ($scope, $http, $sce,  $rootScope, NotificationFactory, MemberFactory) {


  function getImageFromThread (thread) {
    if(thread.indexOf('company-') != -1) {
      return $scope.companies.filter(function(o) {
        return thread.split('company-')[1] == o.id;
      })[0].img;
    }
    else if(thread.indexOf('speaker-') != -1) {
      return $scope.speakers.filter(function(o) {
        return thread.split('speaker-')[1] == o.id;
      })[0].img;
    }
    return undefined;
  }

  function getInfoFromTopic (thread) {
    if(thread.indexOf('topic-') != -1) {
      return $scope.topics.filter(function(o) {
        return thread.split('topic-')[1] == o._id;
      })[0];
    }
  }

  function validateDescription (thread, description) {
    if(thread.indexOf('topic-') != -1 && description.indexOf('comment') != -1) {
      description = description.split('[')[0];
    }
    return description;
  }

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
      for (var i = 0, j = response.length; i < j; i++) {
        //if (response[i].member != me.id){ //uncomment to hide self-events
        var date = new Date(response[i].posted);
        $scope.notifications.unshift({
          path: response[i].thread.replace("-", "/"),
          date: {
            data: date,
            full: date.toString()
          },
          description: validateDescription(response[i].thread, response[i].description),
          thread: response[i].thread,
          member: {
            id: response[i].member,
            name: $scope.members.filter(function(o) {
                    return response[i].member == o.id;
                  })[0].name,
            facebook: $scope.members.filter(function(o) {
                    return response[i].member == o.id;
                  })[0].facebook
          },
          color: (response[i].unread.indexOf($scope.me.id) != -1 ? "unread" : "read"),
          image: getImageFromThread(response[i].thread),
          topic: getInfoFromTopic(response[i].thread)
        });
        //}
      }
      $scope.loading = false;
    });
  }

  $scope.getImageFromThread = function (thread) {
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
  };

  $scope.getInfoFromTopic = function (thread) {
    return $scope.topics.filter(function(o) {
      return thread.split('topic-')[1] == o.id;
    })[0];
  };

  $scope.scroll = function() {
    if ($scope.limit < $scope.notifications.length)
      $scope.limit += 10;
  };

});
