'use strict';

theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory, CommentFactory, NotificationFactory) {

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src+'#page-body');
  }

  $scope.submit = function() {
    var companyData = this.formData;

    CompanyFactory.Company.update({ id:companyData.id }, companyData, function(response) {
      if(response.error) {
        $scope.error = response.error;
      } else {
        $scope.message = response.message;
      }
    });
  };

  $scope.submitComment = function() {
    if ($scope.commentData.markdown == ""){
      $scope.emptyComment = true;
      return;
    }

    console.log("Comment: " + $scope.commentData.markdown);

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

  $scope.quoteComment = function(comment) {
    $scope.commentData.markdown = '> **'+comment.member+' said**:\n> ' + comment.markdown.split('\n').join('\n> ')+'\n';
  };

  $scope.statuses = ['SUGESTÃO','CONTACTADO','EM CONVERSAÇÕES','ACEITOU/EM NEGOCIAÇÕES','NEGOCIO FECHADO','REJEITOU/DESISTIR'];
  $scope.logoSizes = [null, 'S','M','L'];
  $scope.standDays = [null, 1,2,3,4,5];
  $scope.postsNumbers = [null, 1,2,3,4,5];

  CompanyFactory.Company.get({id: $routeParams.id}, function(response) {
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

    NotificationFactory.Company.getAll({id: $routeParams.id}, function(getData) {
      $scope.company.notifications = getData;
      console.log(getData);
    });
  });

  $scope.init = function (){
    $scope.commentData = {
      markdown: ""
    };
    $scope.emptyComment = false;
  };

  $scope.init();
});
