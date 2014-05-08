'use strict';

theToolController.controller('MeetingEditController', function ($scope, $routeParams, MeetingFactory) {

  //================================INITIALIZATION================================

  $scope.success = "";
  $scope.error   = "";

  $scope.noteTypes = ["Info", "To do", "Decision", "Idea"];

  $scope.formData = {};

  MeetingFactory.getAll(function(result) {
    $scope.meeting = result.filter(function(o) {
      return o._id == $routeParams.id;
    })[0];
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
    $scope.formData.notes.push({
      noteType: "Info",
      targets: []
    });
  };

  $scope.removeNote = function(note) {
    $scope.formData.notes.splice($scope.formData.notes.indexOf(note), 1);
  };

  $scope.save = function() {
    $scope.formData.attendants = [];
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      if ($scope.members[i].attending) {
        $scope.formData.attendants.push($scope.members[i].id);
      }
    }

    if (!$scope.formData.title){
      $scope.success = "";
      $scope.error = "Please enter a title.";
      return;
    }

    console.log($scope.formData);

    /*MeetingFactory.update($scope.meeting, function(response) {
      if(response.error) {
        $scope.success = "";
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      } else if (response.success) {
        $scope.error = "";
        $scope.success = response.success;
      }
    });*/
  };

});
