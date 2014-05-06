'use strict';

theToolController.controller('CreateMeetingController', function ($scope, $http, $routeParams, $sce, $location, $rootScope, MeetingFactory, MemberFactory) {

  $scope.success = "";
  $scope.error   = "";

  $scope.formData = {};

  MemberFactory.Member.getAll(function(members) {
    $scope.members = members;
  });

  $scope.submit = function() {
    /*MeetingFactory.create($scope.formData, function(response) {
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.success = response.message;
      }
    });*/

    console.log($scope.formData);
  };

});
