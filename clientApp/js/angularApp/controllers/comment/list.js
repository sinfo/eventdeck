'use strict';

theToolController
  .controller('CommentsController', function ($scope, $http, $routeParams, CommentFactory) {

  $scope.quoteComment = function(comment) {
    $scope.commentData.markdown = '> **'+comment.member+' said**:\n> ' + comment.markdown.split('\n').join('\n> ')+'\n';
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

});
