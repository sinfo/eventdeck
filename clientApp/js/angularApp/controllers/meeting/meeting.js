'use strict';

theToolController.controller('MeetingController', function ($scope, $routeParams, MeetingFactory, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];
  $scope.editTopics = [];
  getMeeting();
  $scope.loading = false;

  function getMeeting(){
    MeetingFactory.getAll(function(meetings) {
      console.log(meetings);
      $scope.meeting = meetings.filter(function(o) {
        return o._id == $routeParams.id;
      })[0];
      console.log($scope.meeting);
      getTopic();
    });
  }

  function getTopic(){
    console.log($scope.meeting.topics);
    console.log($scope.topics);
    for(var i = 0; i < $scope.meeting.topics.length; i++){
      $scope.editTopics.push($scope.topics.filter(function(o) {
          return o._id == $scope.meeting.topics[i];
      })[0]);
    }
    console.log($scope.editTopics);
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

    $scope.editTopics.push(topic);

    /*TopicFactory.Topics.create(topic, function(response) {
      if (response.success) {
        $scope.meeting.topics.push(response.id);
        $scope.editTopics.push(topic);
      }
    });*/
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

  $scope.saveTopic = function(topic) {
    topic.successTopic = "";
    topic.errorTopic   = "";
    if(topic._id){
      TopicFactory.Topic.update({id: topic._id}, topic, function(response) {
        if(response.error) {
          topic.errorTopic = "There was an error. Please contact the Dev Team and give them the details about the error.";
        }
        else if (response.success) {
          topic.successTopic = response.success;
        }
      });
    }
    else{
      TopicFactory.Topic.create(topic, function(response) {
        if(response.error) {
          topic.errorTopic = "There was an error. Please contact the Dev Team and give them the details about the error.";
        }
        else if (response.success) {
          topic._id = response.id;
          $scope.meeting.topics.push(response.id);
          console.log($scope.meeting.topics);
          topic.successTopic = response.success;
        }
      });
    }
  };

  $scope.deleteTopic = function(topic) {
    if(topic._id){
      $scope.meeting.topics.splice($scope.meeting.topics.indexOf(topic._id), 1);
    }
    $scope.editTopics.splice($scope.editTopics.indexOf(topic), 1);
  };

  $scope.saveMeeting = function() {
    $scope.successMeeting = "";
    $scope.errorMeeting   = "";

    if (!$scope.meeting.title){
      $scope.error = "Please enter a title.";
      return;
    }

    for (var i = 0, j = $scope.editTopics.length; i < j; i++) {
      $scope.saveTopic($scope.editTopics[i]);
    }

    MeetingFactory.update({id: $scope.meeting._id}, $scope.meeting, function(response) {
      console.log(response);
      if(response.error) {
        $scope.errorMeeting = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
      else if (response.success) {
        $scope.successMeeting = response.success;
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
