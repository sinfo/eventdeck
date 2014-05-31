'use strict';

theToolServices
  .factory('CommentFactory', function ($resource) {
    return {
      Comment: $resource('/api/comment/:id', null, {
        'getAll': {method: 'GET', isArray: true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Company: $resource('/api/company/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Speaker: $resource('/api/speaker/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Topic: $resource('/api/topic/:id/comments', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    }
  })