'use strict';
 
var theToolServices = angular.module('theTool.services', ['ngResource']);
 
theToolServices
  .factory('CompanyFactory', function($resource) {
    return $resource('/api/company/:id', null, {
      'getAll': {method: 'GET', isArray:true},
      'update': {method: 'PUT'}
    });
  });