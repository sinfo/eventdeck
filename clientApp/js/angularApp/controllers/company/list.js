'use strict';

theToolController
  .controller('CompaniesController', function ($scope, $http, $sce, CompanyFactory, MemberFactory) {
    $scope.saveStatus = function(company) {
      var companyData = company;

      CompanyFactory.Company.update({ id:company.id }, companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    }
  
    $scope.limit = 10;

    $scope.statuses = ['Suggestion','Contacted','In Conversations','In Negotiations','Closed Deal','Rejected','Give Up'];

    CompanyFactory.Company.getAll(function(response) {
      $scope.predicate = 'updated';
      $scope.reverse = true;
      $scope.companies = response;
    });

    $scope.scroll = function() {
      if ($scope.limit <= $scope.companies.length)
        $scope.limit += 10;
    };
  });
  