'use strict';

theToolController.controller('TopicEditController', function ($scope, $routeParams, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";

  TopicFactory.get({id: $routeParams.id}, function(result) {
    $scope.topic = result;
    $scope.model = kindModel(result.kind);
    $scope.loading = false;
  });


  //=================================AUXFUNCTIONS==================================

  function kindModel(kind){
    this.text      = true;
    this.targets = true;
    this.poll      = false;
    this.duedate   = false;
    this.meeting   = true;
    this.closed    = false;
    if(kind === 'To do'){
      this.duedate = true;
    }
    else if(kind === 'Decision'){
      this.closed  = true;
      this.poll = true;
    }
  }

  //===================================FUNCTIONS===================================

  $scope.toggleTarget = function(target) {
    var index = topic.targets.indexOf(target);

    if (index == -1) {
      topic.targets.push(target);
    }
    else {
      topic.targets.splice(index, 1);
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

    TopicFactory.update($scope.topic, function(response) {
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      } else if (response.success) {
        $scope.success = response.success;
      }
    });
  };

});
