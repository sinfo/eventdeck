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
  $routeProvider.otherwise({redirectTo: '/'});
}]);