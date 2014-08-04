'use strict';

theToolDirectives
  .directive('speakerCard', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/speaker/card.html',
      controller: 'SpeakerEmbedController',
      scope: {
        speaker: '=speaker',
        notifications: '=notifications',
        me: '=me',
        members: '=members'
      }
    };
  });
