'use strict';

theToolController.controller('TopicsController', function ($scope, $location, $routeParams, TopicFactory) {

  //================================INITIALIZATION================================

  if($location.path() != '/topics' && $routeParams.id == "me") {
    $location.path('/topics/' + $scope.me.id);
    return;
  }

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  if ($location.path() == '/topics') {
    TopicFactory.Topic.getAll(gotTopics);
  }
  else {
    TopicFactory.Member.getAll({id: $routeParams.id}, gotTopics);
  }

  function gotTopics (topics) {
    setTimeout(function () {
      if ($scope.loading)
        gotTopics(topics);
    }, 1000);

    $scope.topics = topics;

    for (var i = 0, j = $scope.topics.length; i < j; i++) {
      $scope.topics[i].facebook = $scope.members.filter(function(o) {
        return $scope.topics[i].author == o.id;
      })[0].facebook;
    }

    $scope.loading = false;
  }

  $scope.showOpen = true;


  //===================================FUNCTIONS===================================

  $scope.time = function(date) {
    return $scope.timeSince(new Date(date));
  };

  $scope.createTopic = function(kind) {
    var date = new Date();
    TopicFactory.Topic.create({
      //author: $scope.me.id,
      kind: kind
    }, function(response) {
      console.log(response);
      if (response.success) {
        $location.path("/topic/" + response.id + "/edit");
      }
    });
  };

  $scope.shownTopics = function (showOpen) {
    return $scope.topics.filter(function(o) {
      return (showOpen ? !o.closed : o.closed);
    });
  };

});
