'use strict';
 
theToolController
  .controller('CreateSpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory) {
    $scope.submit = function() {
      var speakerData = this.formData;

      SpeakerFactory.Speaker.create(speakerData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    MemberFactory.Member.getAll( function(response) {
      $scope.members = response;
    });
  });