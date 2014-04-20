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
  $routeProvider.when('/'                , {templateUrl: 'views/home.html'        , controller: 'home'});
  $routeProvider.when('/company/:id'     , {templateUrl: 'views/company/view.html', controller: 'CompanyController'});
  $routeProvider.when('/company/:id/edit', {templateUrl: 'views/company/edit.html', controller: 'CompanyController'});
  $routeProvider.when('/member/:id'      , {templateUrl: 'views/member/view.html',  controller: 'MemberController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
},{}],2:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src+'#page-body');
    }
    $scope.convertTextToHtml = function(text) {
      var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var mailExp = /[\w\.\-]+\@([\w\-]+\.)+[\w]{2,4}(?![^<]*>)/ig;

      return text.replace(/\n/g, '<br>').replace(urlExp,"<a href='$1'>$1</a>").replace(mailExp,"<a href='mailto:$&'>$&</a>");  
    }
    $scope.submit = function() {
      var companyData = this.formData;

      CompanyFactory.update({ id:companyData.id }, companyData, function(response) {
        if(response.error) {
          $scope.error = response.error;
        } else {
          $scope.message = response.message;
        }
      });
    };

    CompanyFactory.get({id: $routeParams.id}, function(response) {
      $scope.company = $scope.formData = response;
    });
  });
},{}],3:[function(require,module,exports){
require('./company.js');
},{"./company.js":2}],4:[function(require,module,exports){
theToolController = angular.module('theTool.controllers', []);
 
require('./main');
require('./company');
require('./member');
},{"./company":3,"./main":6,"./member":7}],5:[function(require,module,exports){
'use strict';

theToolController
  .controller('home', function ($scope, $http, $sce, CompanyFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    CompanyFactory.getAll(function(response) {
      $scope.predicate = 'status';
      $scope.reverse = false;
      $scope.companies = response;
    });
  });
  
},{}],6:[function(require,module,exports){
require('./home.js');
},{"./home.js":5}],7:[function(require,module,exports){
require('./member.js');
},{"./member.js":8}],8:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('MemberController', function ($scope, $http, $routeParams, $sce, MemberFactory) {
    MemberFactory.get({id: $routeParams.id}, function(response) {
      $scope.member = response;
    });
  });
},{}],9:[function(require,module,exports){
'use strict';
 
angular.module('theTool.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
},{}],10:[function(require,module,exports){
'use strict';
 
 
angular.module('theTool.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
},{}],11:[function(require,module,exports){
'use strict';
 
var theToolServices = angular.module('theTool.services', ['ngResource']);
 
theToolServices
  .factory('CompanyFactory', function($resource) {
    return $resource('/api/company/:id', null, {
      'getAll': {method: 'GET', isArray:true},
      'update': {method: 'PUT'}
    });
  })

  .factory('MemberFactory', function($resource) {
    return $resource('/api/member/:id', null, {
      'getAll': {method: 'GET', isArray:true}
    });
  });
},{}],12:[function(require,module,exports){
url_prefix = 'http://the-tool.franciscodias.net/';

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./angularApp/app.js":1,"./angularApp/controllers":4,"./angularApp/directives":9,"./angularApp/filters":10,"./angularApp/services":11}]},{},[12])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2FwcC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb21wYW55LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9tZW1iZXIuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2ZpbHRlcnMvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL3NlcnZpY2VzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvdGhlVG9vbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuIFxuYW5ndWxhci5tb2R1bGUoJ3RoZVRvb2wnLCBbXG4gICduZycsXG4gICduZ1JvdXRlJyxcbiAgJ25nU2FuaXRpemUnLFxuICAndGhlVG9vbC5maWx0ZXJzJyxcbiAgJ3RoZVRvb2wuc2VydmljZXMnLFxuICAndGhlVG9vbC5kaXJlY3RpdmVzJyxcbiAgJ3RoZVRvb2wuY29udHJvbGxlcnMnXG5dKS5cbmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignLycgICAgICAgICAgICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnICAgICAgICAsIGNvbnRyb2xsZXI6ICdob21lJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS86aWQnICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvdmlldy5odG1sJywgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS86aWQvZWRpdCcsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvZWRpdC5odG1sJywgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvbWVtYmVyLzppZCcgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL21lbWJlci92aWV3Lmh0bWwnLCAgY29udHJvbGxlcjogJ01lbWJlckNvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogJy8nfSk7XG59XSk7IiwiJ3VzZSBzdHJpY3QnO1xuIFxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcywgJHNjZSwgQ29tcGFueUZhY3RvcnkpIHtcbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMrJyNwYWdlLWJvZHknKTtcbiAgICB9XG4gICAgJHNjb3BlLmNvbnZlcnRUZXh0VG9IdG1sID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgdmFyIHVybEV4cCA9IC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvaWc7XG4gICAgICB2YXIgbWFpbEV4cCA9IC9bXFx3XFwuXFwtXStcXEAoW1xcd1xcLV0rXFwuKStbXFx3XXsyLDR9KD8hW148XSo+KS9pZztcblxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxuL2csICc8YnI+JykucmVwbGFjZSh1cmxFeHAsXCI8YSBocmVmPSckMSc+JDE8L2E+XCIpLnJlcGxhY2UobWFpbEV4cCxcIjxhIGhyZWY9J21haWx0bzokJic+JCY8L2E+XCIpOyAgXG4gICAgfVxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21wYW55RGF0YSA9IHRoaXMuZm9ybURhdGE7XG5cbiAgICAgIENvbXBhbnlGYWN0b3J5LnVwZGF0ZSh7IGlkOmNvbXBhbnlEYXRhLmlkIH0sIGNvbXBhbnlEYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlc3BvbnNlLmVycm9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gcmVzcG9uc2UubWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIENvbXBhbnlGYWN0b3J5LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY29tcGFueSA9ICRzY29wZS5mb3JtRGF0YSA9IHJlc3BvbnNlO1xuICAgIH0pO1xuICB9KTsiLCJyZXF1aXJlKCcuL2NvbXBhbnkuanMnKTsiLCJ0aGVUb29sQ29udHJvbGxlciA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmNvbnRyb2xsZXJzJywgW10pO1xuIFxucmVxdWlyZSgnLi9tYWluJyk7XG5yZXF1aXJlKCcuL2NvbXBhbnknKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignaG9tZScsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYyk7XG4gICAgfVxuXG4gICAgQ29tcGFueUZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUucHJlZGljYXRlID0gJ3N0YXR1cyc7XG4gICAgICAkc2NvcGUucmV2ZXJzZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuICB9KTtcbiAgIiwicmVxdWlyZSgnLi9ob21lLmpzJyk7IiwicmVxdWlyZSgnLi9tZW1iZXIuanMnKTsiLCIndXNlIHN0cmljdCc7XG4gXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignTWVtYmVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIE1lbWJlckZhY3RvcnkpIHtcbiAgICBNZW1iZXJGYWN0b3J5LmdldCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUubWVtYmVyID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcbiBcbmFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmRpcmVjdGl2ZXMnLCBbXSlcbiAgLmRpcmVjdGl2ZSgnYXBwVmVyc2lvbicsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMpIHtcbiAgICAgIGVsbS50ZXh0KHZlcnNpb24pO1xuICAgIH07XG4gIH1dKTsiLCIndXNlIHN0cmljdCc7XG4gXG4gXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pLlxuICBmaWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH1cbiAgfV0pOyIsIid1c2Ugc3RyaWN0JztcbiBcbnZhciB0aGVUb29sU2VydmljZXMgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5zZXJ2aWNlcycsIFsnbmdSZXNvdXJjZSddKTtcbiBcbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ29tcGFueUZhY3RvcnknLCBmdW5jdGlvbigkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL2NvbXBhbnkvOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfVxuICAgIH0pO1xuICB9KVxuXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgfSk7XG4gIH0pOyIsInVybF9wcmVmaXggPSAnaHR0cDovL3RoZS10b29sLmZyYW5jaXNjb2RpYXMubmV0Lyc7XG5cbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9hcHAuanMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2RpcmVjdGl2ZXMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9maWx0ZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvc2VydmljZXMnKTsiXX0=
