'use strict';

theToolController
  .controller('home', function ($scope, $http, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    CompanyFactory.getAll(function(response) {
      $scope.companies = response;
    });
  });
  