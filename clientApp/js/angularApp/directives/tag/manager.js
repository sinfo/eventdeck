'use strict';

theToolDirectives
  .directive('tagManager', function () {
    return {
      restrict: 'EAC',
      replace: true,
      templateUrl: 'views/tag/manager.html',
      controller: 'TagManagerController',
      scope: {
        tags: '=tagsArray',
        search: '=search'
      }
    };
  })