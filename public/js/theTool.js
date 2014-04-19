(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
 
angular.module('theTool', [
  'ng',
  'ngRoute',
  'ngSanitize',
  'theTool.filters',
  'theTool.services',
  'theTool.directives',
  'theTool.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/'           , {templateUrl: 'views/home.html'        , controller: 'home'});
  $routeProvider.when('/company/:id'    , {templateUrl: 'views/company/view.html'         , controller: 'CompanyController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
},{}],2:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    CompanyFactory.get({id: $routeParams.id}, function(response) {
      console.log("FACTORY", response)
      $scope.company = response;
    });
  });
},{}],3:[function(require,module,exports){
require('./company.js');
},{"./company.js":2}],4:[function(require,module,exports){
theToolController = angular.module('theTool.controllers', []);
 
require('./main');
require('./company');
},{"./company":3,"./main":6}],5:[function(require,module,exports){
'use strict';

theToolController
  .controller('home', function ($scope, $http, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    CompanyFactory.getAll(function(response) {
      $scope.companies = response;
    });
  });
  
},{}],6:[function(require,module,exports){
require('./home.js');
},{"./home.js":5}],7:[function(require,module,exports){
'use strict';
 
angular.module('theTool.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
},{}],8:[function(require,module,exports){
'use strict';
 
 
angular.module('theTool.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
},{}],9:[function(require,module,exports){
'use strict';
 
var theToolServices = angular.module('theTool.services', ['ngResource']);
 
theToolServices
  .factory('CompanyFactory', function($resource) {
    return $resource('/api/company/:id', null, {
    	'getAll': {method: 'GET', isArray:true}
    });
  });
},{}],10:[function(require,module,exports){
url_prefix = 'http://the-tool.franciscodias.net/';

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./angularApp/app.js":1,"./angularApp/controllers":4,"./angularApp/directives":7,"./angularApp/filters":8,"./angularApp/services":9}]},{},[10])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2FwcC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb21wYW55LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9maWx0ZXJzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL3RoZVRvb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuIFxuYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wnLCBbXG4gICduZycsXG4gICduZ1JvdXRlJyxcbiAgJ25nU2FuaXRpemUnLFxuICAndGhlVG9vbC5maWx0ZXJzJyxcbiAgJ3RoZVRvb2wuc2VydmljZXMnLFxuICAndGhlVG9vbC5kaXJlY3RpdmVzJyxcbiAgJ3RoZVRvb2wuY29udHJvbGxlcnMnXG5dKS5cbmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignLycgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvaG9tZS5odG1sJyAgICAgICAgLCBjb250cm9sbGVyOiAnaG9tZSd9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL2NvbXBhbnkvOmlkJyAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvdmlldy5odG1sJyAgICAgICAgICwgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86ICcvJ30pO1xufV0pOyIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKTtcbiAgICB9XG5cbiAgICBDb21wYW55RmFjdG9yeS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2coXCJGQUNUT1JZXCIsIHJlc3BvbnNlKVxuICAgICAgJHNjb3BlLmNvbXBhbnkgPSByZXNwb25zZTtcbiAgICB9KTtcbiAgfSk7IiwicmVxdWlyZSgnLi9jb21wYW55LmpzJyk7IiwidGhlVG9vbENvbnRyb2xsZXIgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5jb250cm9sbGVycycsIFtdKTtcbiBcbnJlcXVpcmUoJy4vbWFpbicpO1xucmVxdWlyZSgnLi9jb21wYW55Jyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignaG9tZScsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYyk7XG4gICAgfVxuXG4gICAgQ29tcGFueUZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY29tcGFuaWVzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pO1xuICAiLCJyZXF1aXJlKCcuL2hvbWUuanMnKTsiLCIndXNlIHN0cmljdCc7XG4gXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5kaXJlY3RpdmVzJywgW10pXG4gIC5kaXJlY3RpdmUoJ2FwcFZlcnNpb24nLCBbJ3ZlcnNpb24nLCBmdW5jdGlvbih2ZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzKSB7XG4gICAgICBlbG0udGV4dCh2ZXJzaW9uKTtcbiAgICB9O1xuICB9XSk7IiwiJ3VzZSBzdHJpY3QnO1xuIFxuIFxuYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuZmlsdGVycycsIFtdKS5cbiAgZmlsdGVyKCdpbnRlcnBvbGF0ZScsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xuICAgICAgcmV0dXJuIFN0cmluZyh0ZXh0KS5yZXBsYWNlKC9cXCVWRVJTSU9OXFwlL21nLCB2ZXJzaW9uKTtcbiAgICB9XG4gIH1dKTsiLCIndXNlIHN0cmljdCc7XG4gXG52YXIgdGhlVG9vbFNlcnZpY2VzID0gYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wuc2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSk7XG4gXG50aGVUb29sU2VydmljZXNcbiAgLmZhY3RvcnkoJ0NvbXBhbnlGYWN0b3J5JywgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS9jb21wYW55LzppZCcsIG51bGwsIHtcbiAgICBcdCdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgIH0pO1xuICB9KTsiLCJ1cmxfcHJlZml4ID0gJ2h0dHA6Ly90aGUtdG9vbC5mcmFuY2lzY29kaWFzLm5ldC8nO1xuXG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvYXBwLmpzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvZmlsdGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL3NlcnZpY2VzJyk7Il19
