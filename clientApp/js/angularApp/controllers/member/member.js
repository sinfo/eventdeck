'use strict';
 
theToolController
  .controller('MemberController', function ($scope, $http, $routeParams, $sce, MemberFactory) {
    
    MemberFactory.get({id: $routeParams.id}, function(response) {
      $scope.member = response;
    });
  });