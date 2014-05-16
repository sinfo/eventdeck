'use strict';

theToolController.controller('TopicsController', function ($scope, $rootScope, $location, TopicFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.kinds = ["Info", "To do", "Decision", "Idea"];

  TopicFactory.Topics.getAll(function(topics) {
    $scope.topics = topics;

    for (var i = 0, j = $scope.topics.length; i < j; i++) {
      $scope.topics[i].facebook = $scope.members.filter(function(o) {
        return $scope.topics[i].author == o.id;
      })[0].facebook;
    }

    console.log($scope.topics);

    $scope.loading = false;
  });


  //===================================FUNCTIONS===================================

  $scope.time = function(date) {
    console.log(date)
    return $scope.timeSince(new Date(date));
  };

  $scope.createTopic = function(kind) {
    var date = new Date();
    TopicFactory.Topics.create({
      author: $scope.me.id,
      kind: kind
    }, function(response) {
      console.log(response);
      if (response.success) {
        $location.path("/topic/" + response.id + "/edit");
      }
    });
  };

});
