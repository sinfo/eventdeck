"use strict";

theToolController.controller("MeetingEmbedController", function ($scope, MeetingFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  MeetingFactory.get({id: $scope.meetingId}, function (meeting) {
    $scope.meeting = meeting;

    $scope.loading = false;
  });


  //===================================FUNCTIONS===================================

  $scope.getMember = function (memberId) {
    return $scope.members.filter(function (o) {
      return o.id === memberId;
    })[0];
  };

});
