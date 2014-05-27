"use strict";

theToolController.controller("TopicEmbedController", function ($scope) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success     = "";
  $scope.error       = "";
  $scope.showTargets = false;

  $scope.pollKinds = ['text', 'images'];

  kind($scope.topic);


  //=================================AUXFUNCTIONS==================================

  function kind(topic) {
    topic.show = {
      text     : true,
      targets  : true,
      poll     : false,
      duedate  : false,
      meeting  : true,
      closed   : false
    }
    if(topic.kind === 'To do'){
      topic.show.duedate = true;
      topic.show.closed  = true;
    }
    else if(topic.kind === 'Decision'){
      topic.show.duedate = true;
      topic.show.closed  = true;
      topic.show.poll = true;
    }

    $scope.loading = false;

    setTimeout(function () {
      console.log($scope.topic, $scope.topic['kind']);
    }, 5000);
  }


  //===================================FUNCTIONS===================================

  $scope.deleteTopic = function() {
    var answer = confirm("Are you sure you want to delete this topic?")
    if (answer) {
      TopicFactory.Topic.delete({id: $routeParams.id}, function(result) {
        $location.path("/topics/");
      })
    }
  };

  $scope.toggleTarget = function(target) {
    var index = $scope.topic.targets.indexOf(target);

    if (index == -1) {
      $scope.topic.targets.push(target);
    }
    else {
      $scope.topic.targets.splice(index, 1);
    }
  };

  $scope.toggleAllTargets = function() {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleTarget($scope.members[i].id);
    }
  };

  $scope.toggleRoleTargets = function(roleId) {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      for(var o = 0; o < $scope.members[i].roles.length; o++) {
        if($scope.members[i].roles[o].id == roleId) {
          $scope.toggleTarget($scope.members[i].id);
        }
      }
    }
  };

  $scope.toggleTargets = function() {
    console.log($scope.showTargets);
    $scope.showTargets = !$scope.showTargets;
  };

  $scope.focusOption = function(option) {
    for (var i = 0, j = $scope.topic.poll.options.length; i < j; i++) {
      $scope.topic.poll.options[i].editing = false;
    }

    option.editing = true;
  };

  $scope.addOption = function() {
    var option = {
      optionType: "Info",
      targets: []
    };

    $scope.topic.poll.options.push(option);

    $scope.focusOption(option);
  };

  $scope.removeOption = function(option) {
    $scope.topic.poll.options.splice($scope.topic.poll.options.indexOf(option), 1);
  };

  this.selectOption = function(topic, option) {
    var updatedTopic = topic;

    if(option.votes.indexOf($scope.me.id) != -1) {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.splice(updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.indexOf($scope.me.id),1);
    } else {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.push($scope.me.id);
    }

    TopicFactory.Topic.update({id: updatedTopic._id}, updatedTopic, function(response) {
      if(response.error) {
        console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
      } else if (response.success) {
        console.log(response.success);
      }
    });
  };

  $scope.save = function() {
    $scope.success = "";
    $scope.error   = "";

    TopicFactory.Topic.update({id: $routeParams.id}, $scope.topic, function(response) {
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      } else if (response.success) {
        $scope.success = response.success;
      }
    });
  };

});
