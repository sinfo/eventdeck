'use strict';
 
theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory, CommentFactory) {
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

    $scope.submitComment = function() {
      $scope.loading = true;

      var commentData = this.commentData;
      commentData.thread = 'company-'+this.company.id;

      CommentFactory.Comment.create(commentData, function(data) {
        // if successful, we'll need to refresh the comment list
        CommentFactory.Company.getAll({id: $routeParams.id}, function(getData) {
          $scope.comments = getData;
          $scope.loading = false;
        });
      });
    };

    $scope.getMemberFacebook = function(id) {
      return $scope.members.filter(function(e){
          return e.id == id;
        })[0].facebook;
    }

    $scope.deleteComment = function(id) {
      $scope.loading = true;

      CommentFactory.Comment.delete({id: id}, function(data) {
        // if successful, we'll need to refresh the comment list
        CommentFactory.Company.getAll({id: $routeParams.id}, function(getData) {
          $scope.comments = getData;
          $scope.loading = false;
        });
      });
    };

    CompanyFactory.get({id: $routeParams.id}, function(response) {
      $scope.company = $scope.formData = response;
      
      MemberFactory.Member.getAll( function(response) {
        $scope.members = response;
        $scope.member = $scope.members.filter(function(e){
          return e.id == $scope.formData.member;
        })[0];
      });

      CommentFactory.Company.getAll({id: $routeParams.id}, function(getData) {
        $scope.comments = getData;
        $scope.loading = false;
      });
    });
  });