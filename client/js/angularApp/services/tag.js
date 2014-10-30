'use strict';

eventdeckServices
  .factory('TagFactory', function ($resource) {
    return {
      Tag: $resource(url_prefix+'/tags/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Topic: $resource(url_prefix+'/tags/:id/topics', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })