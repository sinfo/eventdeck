'use strict';
 
var theToolServices = angular.module('theTool.services', ['ngResource']);
 
theToolServices
  .factory('CompanyFactory', function($resource) {
    return $resource('/api/company/:id', null, {
      'getAll': {method: 'GET', isArray:true},
      'update': {method: 'PUT'},
      'create': {method: 'POST'}
    });
  })

  .factory('SpeakerFactory', function($resource) {
    return $resource('/api/speaker/:id', null, {
      'getAll': {method: 'GET', isArray:true},
      'update': {method: 'PUT'},
      'create': {method: 'POST'}
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
  })

  .factory('CommentFactory', function($resource) {
    return {
      Comment: $resource('/api/comment/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/comments', null, {
        'getAll': {method: 'GET', isArray:true}
      })
    } 
  });