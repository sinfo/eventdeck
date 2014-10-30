'use strict';

eventdeckServices
  .factory('ItemFactory', function ($resource) {
    return {
      Item: $resource(url_prefix+'/items/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      })
    }
  })