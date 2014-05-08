'use strict';

theToolController.controller('MeetingEditController', function ($scope, $routeParams, MeetingFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";

  $scope.noteTypes = ["Info", "To do", "Decision", "Idea"];

  MeetingFactory.getAll(function(result) {
    $scope.meeting = result.filter(function(o) {
      return o._id == $routeParams.id;
    })[0];

    while (!$scope.members);

    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.members[i].attending = false;
      for (var k = 0, l = $scope.meeting.attendants.length; k < l; k++) {
        if ($scope.members[i].id == $scope.meeting.attendants[k]){
          $scope.members[i].attending = true;
          break;
        }
      }
    }

    $scope.loading = false;
  });


  //===================================FUNCTIONS===================================

  $scope.toggleAttendant = function(member) {
    member.attending = !member.attending;
  };

  $scope.toggleAttendants = function() {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleAttendant($scope.members[i]);
    }
  };

  $scope.toggleTargets = function(note) {
    note.showTargets = !note.showTargets;
  };

  $scope.toggleTarget = function(target, note) {
    var index = note.targets.indexOf(target);

    if (index == -1) {
      note.targets.push(target);
    }
    else {
      note.targets.splice(index, 1);
    }
  };

  $scope.toggleEdition = function(note) {
    note.editing = !note.editing;
  };

  $scope.addNote = function() {
    $scope.meeting.notes.push({
      noteType: "Info",
      targets: []
    });
  };

  $scope.removeNote = function(note) {
    $scope.meeting.notes.splice($scope.meeting.notes.indexOf(note), 1);
  };

  $scope.save = function() {
    $scope.success = "";
    $scope.error   = "";

    $scope.meeting.attendants = [];
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      if ($scope.members[i].attending) {
        $scope.meeting.attendants.push($scope.members[i].id);
      }
    }

    if (!$scope.meeting.title){
      $scope.success = "";
      $scope.error = "Please enter a title.";
      return;
    }

    MeetingFactory.update($scope.meeting, function(response) {
      if(response.error) {
        $scope.success = "";
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      } else if (response.success) {
        $scope.error = "";
        $scope.success = response.success;
      }
    });
  };

});
