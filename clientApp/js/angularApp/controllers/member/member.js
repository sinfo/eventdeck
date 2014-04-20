'use strict';
 
theToolController
  .controller('MemberController', function ($scope, $http, $routeParams, $sce, MemberFactory) {
    
    MemberFactory.Member.get({id: $routeParams.id}, function(response) {
      $scope.member = response;
    });

    MemberFactory.Companies.getAll({id: $routeParams.id}, function(response) {
      $scope.companies = response;
    });
  });