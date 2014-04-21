'use strict';

theToolController
  .controller('CompaniesController', function ($scope, $http, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.getClassFromKind = function(participation) {
      if(!participation) { return "nope"; }
      if(!participation.kind) { return "sponsor"; }
      var kind = participation.kind.toLowerCase();

      if(kind.indexOf("bronze") != -1) { return "bronze"; } 
      else if(kind.indexOf("prata") != -1) { return "silver"; }
      else { return "sponsor"; }
    }

    CompanyFactory.getAll(function(response) {
      $scope.predicate = 'participation';
      $scope.reverse = false;
      $scope.companies = response;
    });
  });
  