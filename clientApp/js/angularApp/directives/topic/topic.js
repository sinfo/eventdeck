'use strict';

theToolDirectives
  .directive('topic', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/topic/topic.html',
      controller: 'TopicEmbedController',
      scope: {
        topic: '=topicObject',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles',
        tags: '=tagsArray',
        comments: '=commentsArray'
      }
    };
  })
