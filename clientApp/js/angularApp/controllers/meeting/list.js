'use strict';

theToolController.controller('MeetingsController', function ($scope, $location, MeetingFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  MeetingFactory.getAll(function(meetings) {
    $scope.meetings = meetings;

    for (var i = 0, j = $scope.meetings.length; i < j; i++) {
      $scope.meetings[i].facebook = $scope.members.filter(function(o) {
        return $scope.meetings[i].author == o.id;
      })[0].facebook;
    }

    $scope.loading = false;
  });


  //===================================FUNCTIONS===================================

  $scope.time = function(date) {
    return $scope.timeSince(new Date(date));
  };

  $scope.createMeeting = function() {
    var date = new Date();

    MeetingFactory.create({
      author: $scope.me.id,
      title: date.toLocaleDateString("pt-PT") + " - Meeting",
      date: date
    }, function(response) {
      if (response.success) {
        $location.path("/meeting/" + response.id + "/edit");
      }
    });
  };

});
