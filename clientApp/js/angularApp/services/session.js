'use strict';

theToolServices
  .factory('SessionFactory', function ($resource) {
    return {
      Session: $resource('/api/session/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/sessions', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })