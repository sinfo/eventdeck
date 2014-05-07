'use strict';

theToolController.controller('CreateMeetingController', function ($scope, MeetingFactory, MemberFactory) {

  //================================INITIALIZATION================================

  $scope.success  = "";
  $scope.error    = "";
  $scope.formData = {
    title: new Date().toLocaleDateString("pt-PT") + " - Meeting",
    notes: []
  };

  $scope.noteTypes = ["Info", "To do", "Decision", "Idea"];

  MemberFactory.Member.get({id: "me"}, function(me) {
    $scope.formData.author = me.id;
  });

  MemberFactory.Member.getAll(function(members) {
    $scope.members = members;
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

  $scope.toggleEdition = function(note) {
    note.editing = !note.editing;
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

  $scope.addNote = function() {
    $scope.formData.notes.push({
      noteType: "Info",
      targets: []
    });
  };

  $scope.removeNote = function(note) {
    $scope.formData.notes.splice($scope.formData.notes.indexOf(note), 1);
  };

  $scope.submit = function() {
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

    $scope.formData.date = new Date();

    MeetingFactory.create($scope.formData, function(response) {
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
