'use strict';

theToolController
  .controller('MembersController', function ($scope, $http, $sce, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    MemberFactory.Member.getAll(function(response) {
      $scope.predicate = 'name';
      $scope.reverse = false;
      $scope.members = response;
    });
  });

