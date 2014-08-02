"use strict";

theToolDirectives.directive('whenScrolled', ['$timeout', function($timeout) {
  return function(scope, elm, attr) {

    console.log("On directive");

    console.log(elm);

    var raw = elm[0];
    console.log(raw);
    
    $timeout(function() {
      console.log(raw.scrollTop);
      console.log(raw.scrollHeight);
      raw.scrollTop = raw.scrollHeight;          
    });         
    
    elm.bind('scroll', function() {
      if (raw.scrollTop <= 100) { // load more items before you hit the top
        var sh = raw.scrollHeight
        scope.$apply(attr.whenScrolled);
        raw.scrollTop = raw.scrollHeight - sh;
      }
    });
  };
}]);