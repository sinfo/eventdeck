'use strict';

theToolController.controller('MeetingEditController', function ($scope, $routeParams, MeetingFactory, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  MeetingFactory.getAll(function(result) {
    $scope.meeting = result.filter(function(o) {
      return o._id == $routeParams.id;
    })[0];

    $scope.loading = false;
  });


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

  $scope.toggleTargets = function(topic) {
    topic.showTargets = !topic.showTargets;
  };

  $scope.toggleTarget = function(member, topic) {
    var index = topic.targets.indexOf(member);

    if (index == -1) {
      topic.targets.push(member);
    }
    else {
      topic.targets.splice(index, 1);
    }
  };

  $scope.createTopic = function(kind) {
    var topic = {
      author: $scope.me.id,
      text: "",
      targets: [],
      kind: kind,
      closed: false,
      result: "",
      poll: {
        kind: "text",
        options: []
      },
      duedate: null,
      meetings: [$scope.meeting._id],
      root: null,
      posted: new Date()
    };

    $scope.meeting.topics.push(topic);
  };

  $scope.getName = function (member) {
    return $scope.members.filter(function(o) {
      return o.id == member;
    })[0].name;
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
