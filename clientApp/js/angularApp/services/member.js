'use strict';

theToolServices
  .factory('MemberFactory', function ($resource) {
    return {
      Member: $resource('/api/member/:id', null, {
        'getAll': {method: 'GET', isArray:true},
        'update': {method: 'PUT'},
        'create': {method: 'POST'},
        'delete': {method: 'DELETE'}
      }),
      Role: $resource('/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      }),
      Me: $resource('/api/myself', null, {
        'get': {method: 'GET', isArray: false}
      })
    };
  })