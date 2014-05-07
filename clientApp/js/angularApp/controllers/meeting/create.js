'use strict';

theToolController.controller('CreateMeetingController', function ($scope, MeetingFactory, MemberFactory) {

  //================================INITIALIZATION================================

  $scope.success  = "";
  $scope.error    = "";
  $scope.formData = {
    title: new Date().toLocaleDateString("pt-PT") + " - Meeting"
  };

  $scope.noteTypes = ["Info", "To do", "Decision", "Idea"];

  $scope.notes = [];

  MemberFactory.Member.get({id: "me"}, function(me) {
    $scope.author = me;
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

  $scope.addTarget = function(note) {
    if (!note.targets)
      note.targets = [];

    note.targets.push({
      name: "Teste"
    });
  };

  $scope.removeTarget = function(target, targets) {
    targets.splice(targets.indexOf(target), 1);
  };

  $scope.addNote = function() {
    $scope.notes.push({
      type: "Info"
    });
  };

  $scope.removeNote = function(note) {
    $scope.notes.splice($scope.notes.indexOf(note), 1);
  };

  $scope.submit = function() {
    $scope.formData.attendants = [];
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      if ($scope.members[i].attending) {
        $scope.formData.attendants.push($scope.members[i].id);
      }
    }

    if (!$scope.formData.title){
      $scope.error = "Please enter a title.";
      return;
    }

    /*MeetingFactory.create($scope.formData, function(response) {
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.success = response.message;
      }
    });*/

    console.log($scope.formData);
  };

});
