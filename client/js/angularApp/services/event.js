'use strict';

eventdeckServices
  .factory('EventFactory', function ($resource) {
    return {
      Event: $resource(url_prefix+'/events/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      })
    }
  })