'use strict';

theToolController.controller('TopicController', function ($scope, $routeParams, $location, $window, TopicFactory, CommentFactory, NotificationFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.success = "";
  $scope.error   = "";
  $scope.showTargets = false;

  $scope.pollKinds = ['text','images'];

  if ($location.path().indexOf("/topic/") !== -1) {
    TopicFactory.Topic.get({id: $routeParams.id}, function(result) {
      $scope.topic = result;
      $scope.loading = false;
      $scope.model = $scope.kind(result.kind);

      if(!result.topic.poll.kind) {
        $scope.topic.poll.kind = $scope.pollKinds[0];
      }
    });

    $scope.emptyComment = false;

    CommentFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
      //console.log(getData);
      $scope.comments = getData;
      $scope.loading = false;
    });

    NotificationFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
      $scope.topic.notifications = getData;
    });

  }


  //=================================AUXFUNCTIONS==================================



  //===================================FUNCTIONS===================================

  $scope.kind = function (kind){
    $scope.show.text      = true;
    $scope.show.targets   = true;
    $scope.show.poll      = false;
    $scope.show.duedate   = false;
    $scope.show.meeting   = true;
    $scope.show.closed    = false;
    if(kind === 'To do'){
      $scope.show.duedate = true;
      $scope.show.closed  = true;
    }
    else if(kind === 'Decision'){
      $scope.show.duedate = true;
      $scope.show.closed  = true;
      $scope.show.poll = true;
    }
  }

  $scope.deleteTopic = function() {
    var answer = confirm("Are you sure you want to delete this topic?")
    if (answer) {
      TopicFactory.Topic.delete({id: $routeParams.id}, function(result) {
        $location.path("/topics/");
      })
    }
  };

  $scope.toggleTarget = function(target) {
    var index = $scope.topic.targets.indexOf(target);

    if (index == -1) {
      $scope.topic.targets.push(target);
    }
    else {
      $scope.topic.targets.splice(index, 1);
    }
  };

  $scope.toggleAllTargets = function() {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleTarget($scope.members[i].id);
    }
  };

  $scope.toggleTargets = function() {
    console.log($scope.showTargets);
    $scope.showTargets = !$scope.showTargets;
  };

  $scope.focusOption = function(option) {
    for (var i = 0, j = $scope.topic.poll.options.length; i < j; i++) {
      $scope.topic.poll.options[i].editing = false;
    }

    option.editing = true;
  };

  $scope.addOption = function() {
    var option = {
      optionType: "Info",
      targets: []
    };

    $scope.topic.poll.options.push(option);

    $scope.focusOption(option);
  };

  $scope.removeOption = function(option) {
    $scope.topic.poll.options.splice($scope.topic.poll.options.indexOf(option), 1);
  };

  this.selectOption = function(topic, option) {
    var updatedTopic = topic;

    if(option.votes.indexOf($scope.me.id) != -1) {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.splice(updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.indexOf($scope.me.id),1);
    } else {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.push($scope.me.id);
    }

    TopicFactory.Topic.update({id: updatedTopic._id}, updatedTopic, function(response) {
      if(response.error) {
        console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
      } else if (response.success) {
        console.log(response.success);
      }
    });
  };

  $scope.save = function() {
    $scope.success = "";
    $scope.error   = "";

    TopicFactory.Topic.update({id: $routeParams.id}, $scope.topic, function(response) {
      if(response.error) {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      } else if (response.success) {
        $scope.success = response.success;
      }
    });
  };

  //===================================COMMENT STUFF===================================

  $scope.submitComment = function() {
    if ($scope.commentData.markdown == ""){
      $scope.emptyComment = true;
      return;
    }

    $scope.commentsLoading = true;

    var commentData = this.commentData;
    commentData.thread = 'topic-'+$routeParams.id;

    CommentFactory.Comment.create(commentData, function(data) {
      // if successful, we'll need to refresh the comment list
      CommentFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
        $scope.comments = getData;
        $scope.commentsLoading = false;
      });
    });
  };

  $scope.deleteComment = function(id) {
    $scope.commentsLoading = true;

    CommentFactory.Comment.delete({id: id}, function(data) {
      // if successful, we'll need to refresh the comment list
      CommentFactory.Topic.getAll({id: $routeParams.id}, function(getData) {
        $scope.comments = getData;
        $scope.commentsLoading = false;
      });
    });
  };

  $scope.quoteComment = function(comment) {
    $scope.commentData.markdown = '> **'+comment.member+' said**:\n> ' + comment.markdown.split('\n').join('\n> ')+'\n';
  };

  $scope.commentData = {
    markdown: ""
  };

});
