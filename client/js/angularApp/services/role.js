'use strict';

eventdeckServices
  .factory('RoleFactory', function ($resource) {
    return {
      Role: $resource(url_prefix+'/roles/:id', null, {
        'getAll': {method: 'GET', isArray: true},
      }),
      Member: $resource(url_prefix+'/roles/:id/members', null, {
        'getAll': {method: 'GET', isArray: true}
      })
    };
  })
