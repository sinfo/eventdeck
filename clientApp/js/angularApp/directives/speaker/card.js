'use strict';

theToolDirectives
  .directive('speakerCard', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/speaker/card.html',
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
