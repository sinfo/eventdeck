"use strict";

theToolController.controller("MembersController", function ($scope, MemberFactory) {
  $scope.setSearchRole = function (roleId) {
    $scope.searchRoles=roleId;
  };

  MemberFactory.Member.getAll(function (response) {
    $scope.memberPredicate = "name";
    $scope.reverse = false;
    $scope.members = response;
  });
});
