'use strict';
 
theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }
    $scope.convertTextToHtml = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='mailto:$&'>$&</a>");  
    }
    $scope.submit = function() {
      var companyData = this.formData;

      CompanyFactory.update({ id:companyData.id }, companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    CompanyFactory.get({id: $routeParams.id}, function(response) {
      $scope.company = $scope.formData = response;
      
      MemberFactory.Member.getAll( function(response) {
        $scope.members = response;
        $scope.member = $scope.members.filter(function(e){
          return e.id == $scope.formData.member;
        })[0];
        console.log($scope.member);
      });
    });
  });