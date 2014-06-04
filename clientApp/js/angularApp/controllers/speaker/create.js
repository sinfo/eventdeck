'use strict';
 
theToolController
  .controller('CreateSpeakerController', function ($scope, $http, $routeParams, $location, SpeakerFactory) {
    $scope.submit = function() {
      var speakerData = this.formData;

      speakerData.status = 'Suggestion';

      SpeakerFactory.Speaker.create(speakerData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
          $location.path("/speaker/" + response.id);
        }
      });
    };
  });