'use strict';

theToolController
  .controller('SpeakerController', function ($scope, $http, $routeParams, $sce, SpeakerFactory, MemberFactory, CommentFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }
    $scope.convertTextToHtml = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a target=\"_blank\" href='/api/speaker/"+$routeParams.id+"/sendInitialEmail'>$&</a>");
    }
    $scope.convertNewLinesToHtml = function(text) {
      return '<div data-markdown>'+text.replace(/\n/g, '<br>')+'</div>';
    }
    $scope.convertMarkdownToHtml = function(text) {
      return '<div data-markdown>' + text + '</div>';
    }
    $scope.submit = function() {
      var speakerData = this.formData;

      SpeakerFactory.update({ id:speakerData.id }, speakerData, function(response) {
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

    SpeakerFactory.get({id: $routeParams.id}, function(response) {
      $scope.speaker = $scope.formData = response;

      MemberFactory.Member.getAll( function(response) {
        $scope.members = response;
        $scope.member = $scope.members.filter(function(e){
          return e.id == $scope.formData.member;
        })[0];
        console.log($scope.member);
      });

      CommentFactory.Speaker.getAll({id: $routeParams.id}, function(getData) {
        $scope.comments = getData;
        $scope.loading = false;
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
