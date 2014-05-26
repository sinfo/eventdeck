'use strict';
 
theToolController
  .controller('CreateCompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory) {
    $scope.submit = function() {
      var companyData = this.formData;

      CompanyFactory.Company.create(companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    MemberFactory.Member.getAll( function(response) {
      $scope.members = response;
    });
  });