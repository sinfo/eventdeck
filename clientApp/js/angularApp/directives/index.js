'use strict';
 
angular.module('theTool.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    }
  }])
  .directive('markdown', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var htmlText = markdown.toHTML(element.text());
            element.html(htmlText.replace(/\n/g, '<br>'));
        }
    };
  }])
  .directive('compile', ['$compile', function ($compile) {
      return function(scope, element, attrs) {
          scope.$watch(
            function(scope) {
               // watch the 'compile' expression for changes
              return scope.$eval(attrs.compile);
            },
            function(value) {
              // when the 'compile' expression changes
              // assign it into the current DOM
              element.html(value);

              // compile the new DOM and link it to the current
              // scope.
              // NOTE: we only compile .childNodes so that
              // we don't get into infinite loop compiling ourselves
              $compile(element.contents())(scope);
            }
        );
      }
    }]);
