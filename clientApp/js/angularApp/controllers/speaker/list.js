'use strict';

theToolController
  .controller('SpeakersController', function ($scope, $http, $sce, SpeakerFactory, MemberFactory) {
  
    $scope.limit = 10;

    $scope.statuses = ['Suggestion','Contacted','In Conversations','Accepted','Rejected','Give Up'];

    $scope.speakerPredicate = 'updated';
    $scope.reverse = 'true';
    
    SpeakerFactory.Speaker.getAll(function(response) {
      $scope.speakers = response;
    });

    $scope.scroll = function() {
      if ($scope.limit <= $scope.speakers.length)
        $scope.limit += 10;
    };
  });
  