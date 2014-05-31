'use strict';

theToolServices
  .factory('RoleFactory', function ($resource) {
    return {
      Role: $resource('/api/role/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Member: $resource('/api/role/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
