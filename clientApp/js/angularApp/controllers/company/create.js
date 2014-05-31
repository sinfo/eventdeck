'use strict';
 
theToolController
  .controller('CreateCompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory) {
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

    $scope.statuses = ['Suggestion','Contacted','In Conversations','In Negotiations','Closed Deal','Rejected','Give Up'];
  });