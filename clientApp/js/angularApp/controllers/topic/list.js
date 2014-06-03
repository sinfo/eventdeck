"use strict";

theToolController.controller("TopicsController", function ($scope, $location, $routeParams, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  TopicFactory.Topic.getAll(gotTopics);

  function gotTopics (topics) {
    setTimeout(function () {
      if ($scope.loading) {
        gotTopics(topics);
      }
    }, 1000);

    $scope.topics = topics;

    for (var i = 0, j = $scope.topics.length; i < j; i++) {
      $scope.topics[i].facebook = $scope.members.filter(function (o) {
        return $scope.topics[i].author === o.id;
      })[0].facebook;
    }

    $scope.loading = false;
  }

  $scope.showOpen = true;
  $scope.limit = 6;


  //===================================FUNCTIONS===================================

  $scope.time = function(date) {
    return $scope.timeSince(new Date(date));
  };

  $scope.createTopic = function(kind) {
    var date = new Date();
    TopicFactory.Topic.create({
      author: $scope.me.id,
      kind: kind,
      tags: [$scope.searchTopics.tags]
    }, function (response) {
      if (response.success) {
        TopicFactory.Topic.getAll(function (topics) {
          $scope.topics = topics;
          $scope.topics.find(function (o) {
            return o._id == response.id;
          }).editing = true;
        });
      }
    });
  };

  $scope.shownTopics = function (showOpen) {
    return $scope.topics.filter(function(o) {
      return (showOpen ? !o.closed : o.closed);
    });
  };

  $scope.scroll = function() {
    if ($scope.limit < $scope.topics.length)
      $scope.limit += 3;
  };

});
