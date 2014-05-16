'use strict';

theToolController.controller('TopicController', function ($scope, $routeParams, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";

  TopicFactory.Topic.get({id: $routeParams.id}, function(result) {
    $scope.topic = result;
    $scope.loading = false;
    $scope.model = kindModel(result.kind);
  });


  //=================================AUXFUNCTIONS==================================

  function kindModel(kind){
    $scope.show.text      = true;
    $scope.show.targets   = true;
    $scope.show.poll      = false;
    $scope.show.duedate   = false;
    $scope.show.meeting   = true;
    $scope.show.closed    = false;
    if(kind === 'To do'){
      $scope.show.duedate = true;
    }
    else if(kind === 'Decision'){
      $scope.show.duedate = true;
      $scope.show.closed  = true;
      $scope.show.poll = true;
    }
  }

  //===================================FUNCTIONS===================================

  $scope.toggleTarget = function(target) {
    var index = $scope.topic.targets.indexOf(target);

    if (index == -1) {
      $scope.topic.targets.push(target);
    }
    else {
      $scope.topic.targets.splice(index, 1);
    }
  };

  $scope.toggleTargets = function(topic) {
    topic.showTargets = !topic.showTargets;
  };

  /*$scope.getName = function (member) {
    return $scope.members.filter(function(o) {
      return o.id == member;
    })[0].name;
  };*/



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
