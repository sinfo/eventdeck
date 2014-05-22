'use strict';

theToolController.controller('MeetingEditController', function ($scope, $routeParams, MeetingFactory, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  $scope.topics = [];

  MeetingFactory.getAll(function(meetings) {
    $scope.meeting = meetings.filter(function(o) {
      return o._id == $routeParams.id;
    })[0];

    TopicFactory.Topics.getAll(function(topics) {
      for (var i = 0, j = topics.length; i < j; i++) {
        for (var k = 0, l = $scope.meeting.topics.length; k < l; k++) {
          if (topics[i]._id == $scope.meeting.topics[k]) {
            $scope.topics.push(topics[i]);
            break;
          }
        }
      }

      $scope.loading = false;
    });
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

    TopicFactory.Topics.create(topic, function(response) {
      if (response.success) {
        $scope.meeting.topics.push(response.id);
        $scope.topics.push(topic);
      }
    });
  };

  $scope.getName = function (member) {
    return $scope.members.filter(function(o) {
      return o.id == member;
    })[0].name;
  };

  $scope.saveTopic = function(topic) {
    TopicFactory.Topic.update({id: topic._id}, topic);
  };

  $scope.removeTopic = function(topic) {
    $scope.meeting.topics.splice($scope.meeting.topics.indexOf(topic._id), 1);
    $scope.topics.splice($scope.topics.indexOf(topic), 1);
  };

  $scope.save = function() {
    $scope.success = "";
    $scope.error   = "";

    if (!$scope.meeting.title){
      $scope.error = "Please enter a title.";
      return;
    }

    for (var i = 0, j = $scope.topics.length; i < j; i++) {
      TopicFactory.Topic.update({id: $scope.topics[i]._id}, $scope.topics[i]);
    }

    MeetingFactory.update($scope.meeting, function(response) {
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
      else if (response.success) {
        $scope.success = response.success;
      }
    });
  };

});
