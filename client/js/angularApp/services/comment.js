'use strict';

eventdeckServices
  .factory('CommentFactory', function ($resource) {
    return {
      Comment: $resource(url_prefix+'/comments/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource(url_prefix+'/companies/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource(url_prefix+'/speakers/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource(url_prefix+'/topics/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Communication: $resource(url_prefix+'/communications/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })