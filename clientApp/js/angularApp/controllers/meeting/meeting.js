'use strict';

theToolController.controller('MeetingController', function ($scope, $routeParams, $location, MeetingFactory, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];
  $scope.editTopics = [];
  getMeeting();

  function getMeeting(){
    MeetingFactory.get({id: $routeParams.id}, function (meetings) {
      $scope.meeting = meetings[0];
      console.log($scope.meeting);
      getTopic();
      $scope.loading = false;
    });
  }

  function getTopic(){
    for (var i = 0; i < $scope.meeting.topics.length; i++) {
      $scope.editTopics.push($scope.topics.filter(function (o) {
          return o._id == $scope.meeting.topics[i];
      })[0]);
    }
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

  $scope.createTopic = function(kind) {
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

    TopicFactory.Topic.create(topic, function(response) {
      if (response.success) {
        topic._id = response.id;
        $scope.meeting.topics.push(response.id);
        $scope.editTopics.push(topic);
      }
    });
  };

  $scope.addTopic = function(topicId) {

    var addedTopic = $scope.topics.filter(function(o) {
      return o._id == topicId;
    })[0];
    $scope.editTopics.push(addedTopic);
    $scope.meeting.topics.push(topicId);
    $scope.display = false;
  }

  $scope.getName = function (member) {
    return $scope.members.filter(function(o) {
      return o.id == member;
    })[0].name;
  };

  $scope.removeTopic = function(topic) {
    if(topic._id){
      $scope.meeting.topics.splice($scope.meeting.topics.indexOf(topic._id), 1);
    }
    $scope.editTopics.splice($scope.editTopics.indexOf(topic), 1);
  };

  $scope.removeAllTopics = function() {
    $scope.meeting.topics = [];
    $scope.editTopics = [];
  };

  $scope.saveMeeting = function() {
    $scope.successMeeting = "";
    $scope.errorMeeting   = "";

    if (!$scope.meeting.title){
      $scope.error = "Please enter a title.";
      return;
    }

    MeetingFactory.update({id: $scope.meeting._id}, $scope.meeting, function(response) {
      if(response.error) {
        $scope.errorMeeting = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
      else if (response.success) {
        $scope.successMeeting = response.success;
      }
    });
  };

  $scope.deleteMeeting = function() {
    MeetingFactory.delete({id: $scope.meeting._id}, function(response) {
      if(response.error) {
        $scope.errorMeeting = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
      else {
        $location.path("/meetings/");
      }
    });
  };

  $scope.show = function() {
    $scope.display = ($scope.searchTopic ? true : false);
  };

  $scope.noEditFilter = function(topic) {
    for(var i = 0; i < $scope.editTopics.length; i++){
      if(topic._id === $scope.editTopics[i]._id){
        return false;
      }
    }
    return true;
  };

});
