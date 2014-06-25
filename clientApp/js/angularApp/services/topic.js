'use strict';

theToolServices
  .factory('TopicFactory', function ($resource) {
    return {
      Topic: $resource(url_prefix+'/api/topic/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'create': {method: 'POST'},
        'update': {method: 'PUT'},
        'delete': {method: 'DELETE'}
      }),
      Member: $resource(url_prefix+'/api/member/:id/topics', null, {
        'getAll': { method: 'GET', isArray: true }
      })
    };
  })
