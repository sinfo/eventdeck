'use strict';

theToolController
  .controller('MembersController', function ($scope, $http, MemberFactory) {
    $scope.setSearchRole = function(roleId) {
      $scope.searchRoles=roleId;
    }

    MemberFactory.Member.getAll(function(response) {
      $scope.predicate = 'name';
      $scope.reverse = false;
      $scope.members = response;
    });
  });

