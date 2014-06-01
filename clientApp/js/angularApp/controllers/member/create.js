"use strict";

theToolController.controller("CreateMemberController", function ($scope, $http, $location, $routeParams, MemberFactory) {
  
  $scope.formData = {};
  $scope.formData.roles = [];
  $scope.formData.phones = [];

  $scope.submit = function() {
    var memberData = this.formData;

    MemberFactory.Member.create(memberData, function(response) {
      console.log(response)
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.message = response.message;
        $location.path("/member/" + response.id);
      }
    });
  };

});
