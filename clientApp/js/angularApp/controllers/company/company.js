'use strict';
 
theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    CompanyFactory.get({id: $routeParams.id}, function(response) {
      console.log("FACTORY", response)
      $scope.company = response;
    });
  });