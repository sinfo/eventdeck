'use strict';
 
theToolController
  .controller('CommentController', function ($scope, $http, $routeParams, $sce, CommentFactory) {
    $scope.convertNewLinesToHtml = function(text) {
      return text.replace(/\n/g, '<br>');  
    }
    $scope.convertMarkdownToHtml = function(text) {
      return '<div data-markdown>'+text+'</div>';  
    }

    $scope.submitComment = function() {
      $scope.loading = true;

      var commentData = this.commentData;
      
      CommentFactory.Comment.update({ id:commentData._id }, commentData, function(response) {
        // if successful, we'll need to refresh the comment list
        console.log(response);

        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    CommentFactory.Comment.get({id: $routeParams.id}, function(response) {
      $scope.comment = response;
      $scope.commentData = response;
    });
  });