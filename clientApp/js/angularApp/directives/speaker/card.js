'use strict';

theToolDirectives
  .directive('speakerCard', function () {
    return {
      restrict: 'AEC',
      replace: true,
      templateUrl: 'views/speaker/card.html',
      controller: 'SpeakerEmbedController',
      scope: {
        speaker: '=speaker',
        event: '=event',
        notifications: '=notifications',
        me: '=me',
        members: '=members'
      }
    };
  });
