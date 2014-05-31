'use strict';

theToolDirectives
  .directive('speaker', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/speaker/speaker.html',
      controller: 'SpeakerEmbedController',
      scope: {
        speaker: '=speakerObject',
        membersJson: '@members',
        meJson: '@me',
        rolesJson: '@roles',
        comments: '=commentsArray'
      }
    };
  })
