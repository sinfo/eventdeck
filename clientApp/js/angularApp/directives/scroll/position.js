"use strict";

theToolDirectives.directive("scrollPosition", function () {
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, elem, attrs) {
      var handler = function() {
        scope.scroll = elem.scrollTop();
      }
      elem.on('scroll', scope.$apply.bind(scope, handler));
      handler();
    }
  };
});