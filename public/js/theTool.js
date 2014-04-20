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
  $routeProvider.when('/'                , {templateUrl: 'views/company/list.html', controller: 'CompaniesController'});
  $routeProvider.when('/companies/'      , {templateUrl: 'views/company/list.html', controller: 'CompaniesController'});
  $routeProvider.when('/company/'        , {templateUrl: 'views/company/create.html', controller: 'CreateCompanyController'});
  $routeProvider.when('/company/:id'     , {templateUrl: 'views/company/view.html', controller: 'CompanyController'});
  $routeProvider.when('/company/:id/edit', {templateUrl: 'views/company/edit.html', controller: 'CompanyController'});
  $routeProvider.when('/members/'        , {templateUrl: 'views/member/list.html',  controller: 'MembersController'});
  $routeProvider.when('/member/:id'      , {templateUrl: 'views/member/view.html',  controller: 'MemberController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
},{}],2:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory, MemberFactory) {
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

      console.log(companyData.member)

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

    MemberFactory.Member.getAll( function(response) {
      $scope.members = response;
      console.log(response);
    });
  });
},{}],3:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('CreateCompanyController', function ($scope, $http, $routeParams, $sce, CompanyFactory) {
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
  });
},{}],4:[function(require,module,exports){
require('./company.js');
require('./list.js');
require('./create.js');
},{"./company.js":2,"./create.js":3,"./list.js":5}],5:[function(require,module,exports){
'use strict';

theToolController
  .controller('CompaniesController', function ($scope, $http, $sce, CompanyFactory) {
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
theToolController = angular.module('theTool.controllers', []);
 
require('./main');
require('./company');
require('./member');
},{"./company":4,"./main":8,"./member":9}],7:[function(require,module,exports){
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
  
},{}],8:[function(require,module,exports){
require('./home.js');
},{"./home.js":7}],9:[function(require,module,exports){
require('./member.js');
require('./list.js');
},{"./list.js":10,"./member.js":11}],10:[function(require,module,exports){
'use strict';

theToolController
  .controller('MembersController', function ($scope, $http, $sce, MemberFactory) {
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    MemberFactory.Member.getAll(function(response) {
      $scope.predicate = 'role';
      $scope.reverse = false;
      $scope.members = response;
    });
  });
  
},{}],11:[function(require,module,exports){
'use strict';
 
theToolController
  .controller('MemberController', function ($scope, $http, $routeParams, $sce, MemberFactory) {
    
    MemberFactory.Member.get({id: $routeParams.id}, function(response) {
      $scope.member = response;
    });

    MemberFactory.Companies.getAll({id: $routeParams.id}, function(response) {
      $scope.companies = response;
    });
  });
},{}],12:[function(require,module,exports){
'use strict';
 
angular.module('theTool.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
},{}],13:[function(require,module,exports){
'use strict';
 
 
angular.module('theTool.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);
},{}],14:[function(require,module,exports){
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
    return {
      Member: $resource('/api/member/:id', null, {
        'getAll': {method: 'GET', isArray:true}
      }),
      Companies: $resource('/api/member/:id/companies', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    }
  });
},{}],15:[function(require,module,exports){
url_prefix = 'http://the-tool.franciscodias.net/';

require('./angularApp/app.js');
require('./angularApp/controllers');
require('./angularApp/directives');
require('./angularApp/filters');
require('./angularApp/services');
},{"./angularApp/app.js":1,"./angularApp/controllers":6,"./angularApp/directives":12,"./angularApp/filters":13,"./angularApp/services":14}]},{},[15])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2FwcC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9jb21wYW55LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9jb21wYW55L2NyZWF0ZS5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvY29tcGFueS9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL2FuZ3VsYXJBcHAvY29udHJvbGxlcnMvbWFpbi9ob21lLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tYWluL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvaW5kZXguanMiLCIvVXNlcnMveGljb21iZC9Db2RlL25vZGUvc2NyYXBwaW5nL3RoZS10b29sL2NsaWVudEFwcC9qcy9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzL21lbWJlci9saXN0LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9jb250cm9sbGVycy9tZW1iZXIvbWVtYmVyLmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9maWx0ZXJzL2luZGV4LmpzIiwiL1VzZXJzL3hpY29tYmQvQ29kZS9ub2RlL3NjcmFwcGluZy90aGUtdG9vbC9jbGllbnRBcHAvanMvYW5ndWxhckFwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIi9Vc2Vycy94aWNvbWJkL0NvZGUvbm9kZS9zY3JhcHBpbmcvdGhlLXRvb2wvY2xpZW50QXBwL2pzL3RoZVRvb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTs7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcbiBcbmFuZ3VsYXIubW9kdWxlKCd0aGVUb29sJywgW1xuICAnbmcnLFxuICAnbmdSb3V0ZScsXG4gICduZ1Nhbml0aXplJyxcbiAgJ3RoZVRvb2wuZmlsdGVycycsXG4gICd0aGVUb29sLnNlcnZpY2VzJyxcbiAgJ3RoZVRvb2wuZGlyZWN0aXZlcycsXG4gICd0aGVUb29sLmNvbnRyb2xsZXJzJ1xuXSkuXG5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy8nICAgICAgICAgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvY29tcGFueS9saXN0Lmh0bWwnLCBjb250cm9sbGVyOiAnQ29tcGFuaWVzQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIud2hlbignL2NvbXBhbmllcy8nICAgICAgLCB7dGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wYW55L2xpc3QuaHRtbCcsIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNDb250cm9sbGVyJ30pO1xuICAkcm91dGVQcm92aWRlci53aGVuKCcvY29tcGFueS8nICAgICAgICAsIHt0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBhbnkvY3JlYXRlLmh0bWwnLCBjb250cm9sbGVyOiAnQ3JlYXRlQ29tcGFueUNvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9jb21wYW55LzppZCcgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvY29tcGFueS92aWV3Lmh0bWwnLCBjb250cm9sbGVyOiAnQ29tcGFueUNvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9jb21wYW55LzppZC9lZGl0Jywge3RlbXBsYXRlVXJsOiAndmlld3MvY29tcGFueS9lZGl0Lmh0bWwnLCBjb250cm9sbGVyOiAnQ29tcGFueUNvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9tZW1iZXJzLycgICAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvbWVtYmVyL2xpc3QuaHRtbCcsICBjb250cm9sbGVyOiAnTWVtYmVyc0NvbnRyb2xsZXInfSk7XG4gICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9tZW1iZXIvOmlkJyAgICAgICwge3RlbXBsYXRlVXJsOiAndmlld3MvbWVtYmVyL3ZpZXcuaHRtbCcsICBjb250cm9sbGVyOiAnTWVtYmVyQ29udHJvbGxlcid9KTtcbiAgJHJvdXRlUHJvdmlkZXIub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiAnLyd9KTtcbn1dKTsiLCIndXNlIHN0cmljdCc7XG4gXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignQ29tcGFueUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBDb21wYW55RmFjdG9yeSwgTWVtYmVyRmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYysnI3BhZ2UtYm9keScpO1xuICAgIH1cbiAgICAkc2NvcGUuY29udmVydFRleHRUb0h0bWwgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgdXJsRXhwID0gLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9pZztcbiAgICAgIHZhciBtYWlsRXhwID0gL1tcXHdcXC5cXC1dK1xcQChbXFx3XFwtXStcXC4pK1tcXHddezIsNH0oPyFbXjxdKj4pL2lnO1xuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKS5yZXBsYWNlKHVybEV4cCxcIjxhIGhyZWY9JyQxJz4kMTwvYT5cIikucmVwbGFjZShtYWlsRXhwLFwiPGEgaHJlZj0nbWFpbHRvOiQmJz4kJjwvYT5cIik7ICBcbiAgICB9XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbXBhbnlEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgY29uc29sZS5sb2coY29tcGFueURhdGEubWVtYmVyKVxuXG4gICAgICBDb21wYW55RmFjdG9yeS51cGRhdGUoeyBpZDpjb21wYW55RGF0YS5pZCB9LCBjb21wYW55RGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IHJlc3BvbnNlLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBDb21wYW55RmFjdG9yeS5nZXQoe2lkOiAkcm91dGVQYXJhbXMuaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbXBhbnkgPSAkc2NvcGUuZm9ybURhdGEgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbCggZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tZW1iZXJzID0gcmVzcG9uc2U7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcbiBcbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDcmVhdGVDb21wYW55Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMsICRzY2UsIENvbXBhbnlGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbXBhbnlEYXRhID0gdGhpcy5mb3JtRGF0YTtcblxuICAgICAgQ29tcGFueUZhY3RvcnkudXBkYXRlKHsgaWQ6Y29tcGFueURhdGEuaWQgfSwgY29tcGFueURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTsiLCJyZXF1aXJlKCcuL2NvbXBhbnkuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpO1xucmVxdWlyZSgnLi9jcmVhdGUuanMnKTsiLCIndXNlIHN0cmljdCc7XG5cbnRoZVRvb2xDb250cm9sbGVyXG4gIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIENvbXBhbnlGYWN0b3J5KSB7XG4gICAgJHNjb3BlLnRydXN0U3JjID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICByZXR1cm4gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoc3JjKTtcbiAgICB9XG5cbiAgICBDb21wYW55RmFjdG9yeS5nZXRBbGwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5wcmVkaWNhdGUgPSAnc3RhdHVzJztcbiAgICAgICRzY29wZS5yZXZlcnNlID0gZmFsc2U7XG4gICAgICAkc2NvcGUuY29tcGFuaWVzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pO1xuICAiLCJ0aGVUb29sQ29udHJvbGxlciA9IGFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmNvbnRyb2xsZXJzJywgW10pO1xuIFxucmVxdWlyZSgnLi9tYWluJyk7XG5yZXF1aXJlKCcuL2NvbXBhbnknKTtcbnJlcXVpcmUoJy4vbWVtYmVyJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG50aGVUb29sQ29udHJvbGxlclxuICAuY29udHJvbGxlcignaG9tZScsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkc2NlLCBDb21wYW55RmFjdG9yeSkge1xuICAgICRzY29wZS50cnVzdFNyYyA9IGZ1bmN0aW9uKHNyYykge1xuICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHNyYyk7XG4gICAgfVxuXG4gICAgQ29tcGFueUZhY3RvcnkuZ2V0QWxsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUucHJlZGljYXRlID0gJ3N0YXR1cyc7XG4gICAgICAkc2NvcGUucmV2ZXJzZSA9IGZhbHNlO1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuICB9KTtcbiAgIiwicmVxdWlyZSgnLi9ob21lLmpzJyk7IiwicmVxdWlyZSgnLi9tZW1iZXIuanMnKTtcbnJlcXVpcmUoJy4vbGlzdC5qcycpOyIsIid1c2Ugc3RyaWN0JztcblxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ01lbWJlcnNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRzY2UsIE1lbWJlckZhY3RvcnkpIHtcbiAgICAkc2NvcGUudHJ1c3RTcmMgPSBmdW5jdGlvbihzcmMpIHtcbiAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChzcmMpO1xuICAgIH1cblxuICAgIE1lbWJlckZhY3RvcnkuTWVtYmVyLmdldEFsbChmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLnByZWRpY2F0ZSA9ICdyb2xlJztcbiAgICAgICRzY29wZS5yZXZlcnNlID0gZmFsc2U7XG4gICAgICAkc2NvcGUubWVtYmVycyA9IHJlc3BvbnNlO1xuICAgIH0pO1xuICB9KTtcbiAgIiwiJ3VzZSBzdHJpY3QnO1xuIFxudGhlVG9vbENvbnRyb2xsZXJcbiAgLmNvbnRyb2xsZXIoJ01lbWJlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zLCAkc2NlLCBNZW1iZXJGYWN0b3J5KSB7XG4gICAgXG4gICAgTWVtYmVyRmFjdG9yeS5NZW1iZXIuZ2V0KHtpZDogJHJvdXRlUGFyYW1zLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5tZW1iZXIgPSByZXNwb25zZTtcbiAgICB9KTtcblxuICAgIE1lbWJlckZhY3RvcnkuQ29tcGFuaWVzLmdldEFsbCh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuY29tcGFuaWVzID0gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcbiBcbmFuZ3VsYXIubW9kdWxlKCd0aGVUb29sLmRpcmVjdGl2ZXMnLCBbXSlcbiAgLmRpcmVjdGl2ZSgnYXBwVmVyc2lvbicsIFsndmVyc2lvbicsIGZ1bmN0aW9uKHZlcnNpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMpIHtcbiAgICAgIGVsbS50ZXh0KHZlcnNpb24pO1xuICAgIH07XG4gIH1dKTsiLCIndXNlIHN0cmljdCc7XG4gXG4gXG5hbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5maWx0ZXJzJywgW10pLlxuICBmaWx0ZXIoJ2ludGVycG9sYXRlJywgWyd2ZXJzaW9uJywgZnVuY3Rpb24odmVyc2lvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRleHQpLnJlcGxhY2UoL1xcJVZFUlNJT05cXCUvbWcsIHZlcnNpb24pO1xuICAgIH1cbiAgfV0pOyIsIid1c2Ugc3RyaWN0JztcbiBcbnZhciB0aGVUb29sU2VydmljZXMgPSBhbmd1bGFyLm1vZHVsZSgndGhlVG9vbC5zZXJ2aWNlcycsIFsnbmdSZXNvdXJjZSddKTtcbiBcbnRoZVRvb2xTZXJ2aWNlc1xuICAuZmFjdG9yeSgnQ29tcGFueUZhY3RvcnknLCBmdW5jdGlvbigkcmVzb3VyY2UpIHtcbiAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL2NvbXBhbnkvOmlkJywgbnVsbCwge1xuICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9LFxuICAgICAgJ3VwZGF0ZSc6IHttZXRob2Q6ICdQVVQnfVxuICAgIH0pO1xuICB9KVxuXG4gIC5mYWN0b3J5KCdNZW1iZXJGYWN0b3J5JywgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1lbWJlcjogJHJlc291cmNlKCcvYXBpL21lbWJlci86aWQnLCBudWxsLCB7XG4gICAgICAgICdnZXRBbGwnOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTp0cnVlfVxuICAgICAgfSksXG4gICAgICBDb21wYW5pZXM6ICRyZXNvdXJjZSgnL2FwaS9tZW1iZXIvOmlkL2NvbXBhbmllcycsIG51bGwsIHtcbiAgICAgICAgJ2dldEFsbCc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OnRydWV9XG4gICAgICB9KVxuICAgIH1cbiAgfSk7IiwidXJsX3ByZWZpeCA9ICdodHRwOi8vdGhlLXRvb2wuZnJhbmNpc2NvZGlhcy5uZXQvJztcblxucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2FwcC5qcycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2NvbnRyb2xsZXJzJyk7XG5yZXF1aXJlKCcuL2FuZ3VsYXJBcHAvZGlyZWN0aXZlcycpO1xucmVxdWlyZSgnLi9hbmd1bGFyQXBwL2ZpbHRlcnMnKTtcbnJlcXVpcmUoJy4vYW5ndWxhckFwcC9zZXJ2aWNlcycpOyJdfQ==
