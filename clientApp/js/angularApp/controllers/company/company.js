'use strict';

theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory, NotificationFactory) {

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src+'#page-body');
  }

  $scope.submit = function() {
    var companyData = this.formData;

    CompanyFactory.Company.update({ id:companyData.id }, companyData, function(response) {
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.message = response.success;
      }
    });
  };

  $scope.statuses = ['SUGGESTION','CONTACTED','IN CONVERSATIONS','ACCEPTED/IN NEGOTIATIONS','CLOSED DEAL','REJECTED/GIVE UP'];
  $scope.logoSizes = [null, 'S','M','L'];
  $scope.standDays = [null, 1,2,3,4,5];
  $scope.postsNumbers = [null, 1,2,3,4,5];

  $scope.company = $scope.formData = $scope.getCompany($routeParams.id);

  CompanyFactory.Company.get({id: $routeParams.id}, function(response) {
    $scope.company = $scope.formData = response;

    NotificationFactory.Company.getAll({id: $routeParams.id}, function(getData) {
      $scope.company.notifications = getData;

      $scope.loading = false;
    });
  });

});
