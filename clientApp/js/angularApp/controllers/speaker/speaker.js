'use strict';

theToolController
  .controller('SpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory, CommentFactory, NotificationFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }

    $scope.submit = function() {
      var speakerData = this.formData;

      SpeakerFactory.Speaker.update({ id:speakerData.id }, speakerData, function(response) {
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

      $scope.loading = true;

      var commentData = this.commentData;
      commentData.thread = 'speaker-'+this.speaker.id;

      CommentFactory.Comment.create(commentData, function(data) {
        // if successful, we'll need to refresh the comment list
        CommentFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
          $scope.comments = getData;
          $scope.loading = false;
        });
      });
    };

    $scope.deleteComment = function(id) {
      $scope.loading = true;

      CommentFactory.Comment.delete({id: id}, function(data) {
        // if successful, we'll need to refresh the comment list
        CommentFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
          $scope.comments = getData;
          $scope.loading = false;
        });
      });
    };

    $scope.quoteComment = function(comment) {
      $scope.commentData.markdown = '> **'+comment.member+' said**:\n> ' + comment.markdown.split('\n').join('\n> ')+'\n';
    };

    $scope.statuses = ['SUGGESTION','CONTACTED','IN CONVERSATIONS','ACCEPTED','CLOSED DEAL','REJECTED/GIVE UP'];

    $scope.speaker = $scope.formData = $scope.getSpeaker($routeParams.id);

    SpeakerFactory.Speaker.get({id: $routeParams.id}, function(response) {
      console.log(response);
      $scope.speaker = $scope.formData = response;

      CommentFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
        $scope.comments = getData;
        $scope.loading = false;
      });

      NotificationFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
        $scope.speaker.notifications = getData;
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
