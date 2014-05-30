"use strict";

theToolController.controller("MeetingController", function ($scope, $routeParams, $location, MeetingFactory, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  MeetingFactory.get({id: $routeParams.id}, function (meeting) {
    $scope.meeting = meeting;

    $scope.loading = false;
  });


  //===================================FUNCTIONS===================================

  $scope.toggleAttendant = function (member) {
    var index = $scope.meeting.attendants.indexOf(member);

    if (index === -1) {
      $scope.meeting.attendants.push(member);
    }
    else {
      $scope.meeting.attendants.splice(index, 1);
    }
  };

  $scope.toggleAttendants = function () {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleAttendant($scope.members[i].id);
    }
  };

  $scope.createTopic = function (kind) {
    var topic = {
      editing: true,
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

    TopicFactory.Topic.create(topic, function (response) {
      if (response.success) {
        topic._id = response.id;
        $scope.meeting.topics.push(topic);
      }
    });
  };

  $scope.addTopic = function (topicId) {
    $scope.display = false;

    var topic = $scope.topics.filter(function (o) {
      return o._id === topicId;
    })[0];

    $scope.meeting.topics.push(topic);

    topic.meetings.push($scope.meeting._id);
    TopicFactory.Topic.update({id: topic._id}, topic);
  };

  $scope.removeTopic = function (topic) {
    $scope.meeting.topics.splice($scope.meeting.topics.indexOf(topic), 1);

    topic.meetings.splice(topic.meetings.indexOf($scope.meeting._id), 1);
    TopicFactory.Topic.update({id: topic._id}, topic);
  };

  $scope.saveMeeting = function () {
    $scope.success = "";
    $scope.error   = "";

    if (!$scope.meeting.title){
      $scope.error = "Please enter a title.";
      return;
    }

    MeetingFactory.update({id: $scope.meeting._id}, $scope.meeting, function (response) {
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
      else if (response.success) {
        $scope.success = response.success;
      }
    });
  };

  $scope.deleteMeeting = function () {
    if (confirm("Are you sure you want to delete this meeting?")) {
      MeetingFactory.delete({id: $scope.meeting._id}, function (response) {
        if(response.error) {
          $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
        }
        else {
          $location.path("/meetings/");
        }
      });
    }
  };

  $scope.show = function () {
    $scope.display = ($scope.searchTopic ? true : false);
  };

  $scope.alreadyInMeetingFilter = function (topic) {
    for (var i = 0; i < $scope.meeting.topics.length; i++) {
      if ($scope.meeting.topics[i]._id === topic._id) {
        return false;
      }
    }
    return true;
  };

});
