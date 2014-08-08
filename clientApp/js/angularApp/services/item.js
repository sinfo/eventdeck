'use strict';

theToolServices
  .factory('ItemFactory', function ($resource) {
    return {
      Item: $resource(url_prefix+'/api/item/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      })
    }
  })