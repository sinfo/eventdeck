"use strict";

theToolController.controller("CommentAreaController", function ($scope, $http, $routeParams, MemberFactory, CommentFactory) {

  MemberFactory.Member.getAll(function (members) {
    $scope.members = members;
  });

  if ($scope.thread.indexOf("company-") != -1) {
    CommentFactory.Company.getAll({id: $scope.thread.split("-")[1]}, gotComments);
  }

  function gotComments(comments) {
    $scope.comments = comments;
  }

  $scope.quoteComment = function(comment) {
    $scope.commentData.markdown = "> **" + comment.member + " said**:\n> " + comment.markdown.split("\n").join("\n> ") + "\n";
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

  $scope.getMember = function (memberId) {
    return $scope.members.filter(function(o) {
      return o.id == memberId;
    })[0];
  };

});
