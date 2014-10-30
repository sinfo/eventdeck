'use strict';

eventdeckServices
  .factory('TopicFactory', function ($resource) {
    return {
      Topic: $resource(url_prefix+'/topics/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'create': {method: 'POST'},
        'update': {method: 'PUT'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource(url_prefix+'/members/:id/topics', null, {
        'getAll': { method: 'GET', isArray: true }
      })
    };
  })
