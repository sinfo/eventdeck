'use strict';

theToolController.controller('CreateMeetingController', function ($scope, $http, $routeParams, $sce, $location, $rootScope, MeetingFactory, MemberFactory) {

  $scope.success  = "";
  $scope.error    = "";
  $scope.formData = {};

  MemberFactory.Member.get({id: "me"}, function(me) {
    $scope.author = me;
  });

  MemberFactory.Member.getAll(function(members) {
    $scope.members = members;
  });

  $scope.submit = function() {
    $scope.formData.attendants = [];
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      if ($scope.members[i].attending) {
        $scope.formData.attendants.push($scope.members[i].id);
      }
    }

    if (!$scope.formData.title){
      $scope.error = "Please enter a title.";
      return;
    }

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
