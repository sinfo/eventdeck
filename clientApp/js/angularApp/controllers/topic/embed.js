"use strict";

theToolController.controller("TopicEmbedController", function ($scope, TopicFactory, NotificationFactory) {

  //================================INITIALIZATION================================

  $scope.loading = true;

  $scope.error       = "";
  $scope.showTargets = false;

  $scope.pollKinds = ["text", "images"];

  if ($scope.comments) {
    $scope.topic.comments = $scope.comments.filter(function (e) {
      return e.thread == "topic-" + $scope.topic._id;
    });
  }

  show($scope.topic);


  //=================================AUXFUNCTIONS==================================

  function show(topic) {
    topic.show = {
      text     : true,
      targets  : true,
      poll     : false,
      duedate  : false,
      meeting  : true,
      closed   : false
    };

    if (topic.kind === "To do") {
      topic.show.duedate = true;
      topic.show.closed  = true;
    }
    else if (topic.kind === "Decision") {
      topic.show.duedate = true;
      topic.show.closed  = true;
      topic.show.poll = true;
    }

    $scope.loading = false;
  }

  $scope.checkPermission = function (topic) {
    if (!$scope.me.roles) { return false; }

    var roles = $scope.me.roles.filter(function (o) {
      return o.id == 'development-team' || o.id == 'coordination';
    });

    if (roles.length == 0 && topic.author != $scope.me.id) {
      return false;
    }

    return true;
  }


  //===================================FUNCTIONS===================================

  $scope.deleteTopic = function (topic) {
    if (confirm("Are you sure you want to delete this topic?")) {
      TopicFactory.Topic.delete({id: topic._id}, function () {
        topic.deleted = true;
      });
    }
  };

  $scope.toggleTag = function (tag) {
    var index = $scope.topic.tags.indexOf(tag);

    if (index == -1) {
      $scope.topic.tags.push(tag);
    }
    else {
      $scope.topic.tags.splice(index, 1);
    }
  };

  $scope.getTagIcon = function (tag) {
    return ($scope.topic.tags.indexOf(tag.id) !== -1 ? "check" : "times");;
  };

  $scope.toggleTarget = function (target) {
    var index = $scope.topic.targets.indexOf(target);

    if (index == -1) {
      $scope.topic.targets.push(target);
    }
    else {
      $scope.topic.targets.splice(index, 1);
    }
  };

  $scope.toggleAllTargets = function () {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      $scope.toggleTarget($scope.members[i].id);
    }
  };

  $scope.toggleRoleTargets = function (roleId) {
    for (var i = 0, j = $scope.members.length; i < j; i++) {
      for(var o = 0; o < $scope.members[i].roles.length; o++) {
        if ($scope.members[i].roles[o].id == roleId) {
          $scope.toggleTarget($scope.members[i].id);
        }
      }
    }
  };

  $scope.toggleTargets = function () {
    $scope.showTargets = !$scope.showTargets;
  };

  $scope.getTargetColor = function (memberId) {
    return ($scope.topic.targets.indexOf(memberId) !== -1 ? "blue" : "");
  };

  $scope.focusOption = function (option) {
    for (var i = 0, j = $scope.topic.poll.options.length; i < j; i++) {
      $scope.topic.poll.options[i].editing = false;
    }

    option.editing = true;
  };

  $scope.addOption = function () {
    var option = {
      optionType: "Info",
      targets: []
    };

    $scope.topic.poll.options.push(option);

    $scope.focusOption(option);
  };

  $scope.removeOption = function (option) {
    $scope.topic.poll.options.splice($scope.topic.poll.options.indexOf(option), 1);
  };

  $scope.selectOption = function (topic, option) {
    var updatedTopic = topic;

    if (option.votes.indexOf($scope.me.id) !== -1) {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.splice(updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.indexOf($scope.me.id), 1);
    }
    else {
      updatedTopic.poll.options[updatedTopic.poll.options.indexOf(option)].votes.push($scope.me.id);
    }

    updatedTopic._voting = true;

    TopicFactory.Topic.update({id: updatedTopic._id}, updatedTopic, function (response) {
      if (response.error) {
        console.log("There was an error. Please contact the Dev Team and give them the details about the error.");
      }
      else if (response.success) {
        //console.log(response.success);
      }
    });
  };

  $scope.save = function (topic) {
    $scope.error = "";

    TopicFactory.Topic.update({id: topic._id}, topic, function (response) {
      if (response.success) {
        topic.editing = !topic.editing;
      }
      else {
        $scope.error = "There was an error. Please contact the Dev Team and give them the details about the error.";
      }
    });
  };

  $scope.read = function (topic) {
    if (!$scope.notifications) {
      return;
    }

    $scope.notifications.filter(function (o) {
      return o.thread === "topic-" + topic._id;
    }).forEach(function (notification) {
      var index = notification.unread.indexOf($scope.me.id);
      if (index !== -1) {
        notification.unread.splice(index, 1);
        NotificationFactory.Notification.update({id: notification._id}, notification);
      }
    });
  };

  $scope.getMember = function (memberId) {
    var member = $scope.members.filter(function (o) {
      return o.id == memberId;
    });

    if (member && member.length > 0) {
      return member[0];
    }
    else {
      return {
        name: "No one",
        facebook: "100000456335972"
      };
    }
  };

  $scope.getUnreadNotifications = function (thread) {
    var notifications = $scope.notifications.filter(function(o) {
      return o.thread == thread && o.unread.indexOf($scope.me.id) != -1;
    });

    return notifications;
  };

  $scope.timeSince =function (date) {
    date = new Date(date);
    var seconds = Math.floor((Date.now() - date) / 1000);

    var suffix = "ago";
    if (seconds < 0){
      seconds = Math.abs(seconds);
      suffix = "to go";
    }

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years " + suffix;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months " + suffix;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days " + suffix;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours " + suffix;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes " + suffix;
    }
    return Math.floor(seconds) + " seconds " + suffix;
  };

  $scope.formatDate = function (time) {
    return new Date(time).toUTCString();
  };

});
