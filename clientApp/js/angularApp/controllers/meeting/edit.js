'use strict';

theToolController.controller('MeetingEditController', function ($scope, $routeParams, MeetingFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";

  $scope.noteTypes = ["Info", "To do", "Decision", "Idea"];

  init();

  function init() {
    setTimeout(function() {
      if ($scope.loading) {
        init();
      }
    }, 1000);

    MeetingFactory.getAll(function(result) {
      $scope.meeting = result.filter(function(o) {
        return o._id == $routeParams.id;
      })[0];

      $scope.loading = false;
    });
  }


  //===================================FUNCTIONS===================================

  $scope.toggleAttendant = function(member) {
    var index = $scope.meeting.attendants.indexOf(member);

    if (index == -1) {
      $scope.meeting.attendants.push(member);
    }
    else {
      $scope.meeting.attendants.splice(index, 1);
    }
  };

  $scope.toggleAttendants = function() {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleAttendant($scope.members[i].id);
    }
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

  $scope.toggleTargets = function(note) {
    note.showTargets = !note.showTargets;
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

    if (!$scope.meeting.title){
      $scope.error = "Please enter a title.";
      return;
    }

    MeetingFactory.update($scope.meeting, function(response) {
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      } else if (response.success) {
        $scope.success = response.success;
      }
    });
  };

});
