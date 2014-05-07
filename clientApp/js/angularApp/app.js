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
  $routeProvider.when('/'                    , {templateUrl: 'views/home.html',            controller: 'home'});
  $routeProvider.when('/companies/'          , {templateUrl: 'views/company/list.html',    controller: 'CompaniesController'});
  $routeProvider.when('/companies/table/'    , {templateUrl: 'views/company/table.html',   controller: 'CompaniesController'});
  $routeProvider.when('/companies/budget/'   , {templateUrl: 'views/company/budget.html',  controller: 'CompaniesController'});
  $routeProvider.when('/company/'            , {templateUrl: 'views/company/create.html',  controller: 'CreateCompanyController'});
  $routeProvider.when('/company/:id'         , {templateUrl: 'views/company/view.html',    controller: 'CompanyController'});
  $routeProvider.when('/company/:id/edit'    , {templateUrl: 'views/company/edit.html',    controller: 'CompanyController'});
  $routeProvider.when('/company/:id/confirm' , {templateUrl: 'views/company/confirm.html', controller: 'CompanyEmailController'});
  $routeProvider.when('/comment/:id/edit'    , {templateUrl: 'views/comment/edit.html',    controller: 'CommentController'});
  $routeProvider.when('/speakers/'           , {templateUrl: 'views/speaker/list.html',    controller: 'SpeakersController'});
  $routeProvider.when('/speakers/table/'     , {templateUrl: 'views/speaker/table.html',   controller: 'SpeakersController'});
  $routeProvider.when('/speaker/'            , {templateUrl: 'views/speaker/create.html',  controller: 'CreateSpeakerController'});
  $routeProvider.when('/speaker/:id'         , {templateUrl: 'views/speaker/view.html',    controller: 'SpeakersController'});
  $routeProvider.when('/speaker/:id/edit'    , {templateUrl: 'views/speaker/edit.html',    controller: 'SpeakersController'});
  $routeProvider.when('/speaker/:id/confirm' , {templateUrl: 'views/speaker/confirm.html', controller: 'SpeakerEmailController'});
  $routeProvider.when('/members/'            , {templateUrl: 'views/member/list.html',     controller: 'MembersController'});
  $routeProvider.when('/member/:id'          , {templateUrl: 'views/member/view.html',     controller: 'MemberController'});
  $routeProvider.when('/meetings'            , {templateUrl: 'views/meeting/list.html',    controller: 'MeetingsController'});
  $routeProvider.when('/meeting/create'      , {templateUrl: 'views/meeting/create.html',  controller: 'CreateMeetingController'});
  $routeProvider.when('/chats'               , {templateUrl: 'views/chat/list.html',       controller: 'ChatController'});
  $routeProvider.when('/chat'                , {templateUrl: 'views/chat/view.html',       controller: 'MessageController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
